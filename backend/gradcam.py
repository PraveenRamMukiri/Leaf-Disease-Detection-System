"""Memory-conscious Grad-CAM and Score-CAM for the LeafNet model.

The functions retain the public signatures used by server.py. They expect a
single RGB image batch with shape (1, 224, 224, 3), normalized to [0, 1].
"""
import tensorflow as tf
import numpy as np


def _get_model_parts(model):
    """Return the MobileNetV2 feature extractor and classification head."""
    base_model = model.get_layer("mobilenetv2_1.00_224")
    last_conv_layer = base_model.get_layer("Conv_1")

    classifier_input = tf.keras.Input(
        shape=tuple(last_conv_layer.output.shape[1:])
    )
    x = classifier_input
    for layer_name in ("flatten", "dropout", "dense", "dense_1"):
        x = model.get_layer(layer_name)(x)
    classifier_model = tf.keras.Model(classifier_input, x)

    conv_model = tf.keras.Model(
        inputs=base_model.input,
        outputs=last_conv_layer.output
    )
    return conv_model, classifier_model


def _normalize_heatmap(heatmap):
    heatmap = tf.cast(heatmap, tf.float32)
    heatmap = tf.maximum(heatmap, 0.0)
    maximum = tf.reduce_max(heatmap)
    return tf.where(
        maximum > 1e-8,
        heatmap / (maximum + 1e-8),
        tf.zeros_like(heatmap)
    )


def generate_gradcam(model, img_array):
    """Generate a normalized Grad-CAM heatmap for the predicted class."""
    img_array = tf.convert_to_tensor(img_array, dtype=tf.float32)
    conv_model, classifier_model = _get_model_parts(model)

    with tf.GradientTape() as tape:
        conv_outputs = conv_model(img_array, training=False)
        tape.watch(conv_outputs)
        predictions = classifier_model(conv_outputs, training=False)
        class_idx = tf.argmax(predictions[0])
        class_score = predictions[:, class_idx]

    gradients = tape.gradient(class_score, conv_outputs)
    if gradients is None:
        raise RuntimeError("Grad-CAM could not calculate model gradients")

    pooled_gradients = tf.reduce_mean(gradients, axis=(0, 1, 2))
    feature_maps = conv_outputs[0]
    heatmap = tf.reduce_sum(
        feature_maps * pooled_gradients,
        axis=-1
    )
    heatmap = _normalize_heatmap(heatmap)
    return heatmap.numpy()


def generate_scorecam(model, img_array, max_channels=8, batch_size=2):
    """Generate Score-CAM while limiting channel count and inference batch RAM.

    Only the strongest activation channels are used. Masked images are passed
    through the feature extractor in small batches instead of one large batch.
    """
    if max_channels < 1:
        raise ValueError("max_channels must be at least 1")
    if batch_size < 1:
        raise ValueError("batch_size must be at least 1")

    img_array = tf.convert_to_tensor(img_array, dtype=tf.float32)
    if img_array.shape.rank != 4 or img_array.shape[0] != 1:
        raise ValueError("Score-CAM expects one image with a batch dimension")

    conv_model, classifier_model = _get_model_parts(model)
    conv_outputs = conv_model(img_array, training=False)
    feature_maps = conv_outputs[0]

    channel_strength = tf.reduce_mean(
        tf.abs(feature_maps),
        axis=(0, 1)
    )
    channel_count = int(feature_maps.shape[-1])
    selected_count = min(int(max_channels), channel_count)
    selected_indices = tf.argsort(
        channel_strength,
        direction="DESCENDING"
    )[:selected_count]
    selected_maps = tf.gather(feature_maps, selected_indices, axis=-1)

    map_min = tf.reduce_min(selected_maps, axis=(0, 1), keepdims=True)
    map_max = tf.reduce_max(selected_maps, axis=(0, 1), keepdims=True)
    normalized_maps = (
        selected_maps - map_min
    ) / (
        map_max - map_min + 1e-8
    )

    input_height = int(img_array.shape[1])
    input_width = int(img_array.shape[2])
    resized_maps = tf.image.resize(
        tf.transpose(normalized_maps, [2, 0, 1])[..., tf.newaxis],
        (input_height, input_width),
        method="bilinear"
    )
    resized_maps = tf.squeeze(resized_maps, axis=-1)

    # Build masked inputs only for the current small batch.
    image = img_array[0]
    original_logits = classifier_model(conv_outputs, training=False)
    class_index = tf.argmax(original_logits[0])
    scores_per_channel = []

    for start in range(0, selected_count, int(batch_size)):
        end = min(start + int(batch_size), selected_count)
        maps_chunk = resized_maps[start:end]
        masked_chunk = image[tf.newaxis, ...] * maps_chunk[..., tf.newaxis]

        masked_features = conv_model(masked_chunk, training=False)
        masked_predictions = classifier_model(
            masked_features,
            training=False
        )
        probabilities = tf.nn.softmax(masked_predictions, axis=-1)

        # Score the class predicted for the unmasked original image.
        chunk_scores = probabilities[:, class_index]
        scores_per_channel.append(chunk_scores)

        del maps_chunk, masked_chunk, masked_features
        del masked_predictions, probabilities, chunk_scores

    channel_scores = tf.concat(scores_per_channel, axis=0)
    score_min = tf.reduce_min(channel_scores)
    score_max = tf.reduce_max(channel_scores)
    weights = (
        channel_scores - score_min
    ) / (
        score_max - score_min + 1e-8
    )

    heatmap = tf.reduce_sum(
        resized_maps * weights[:, tf.newaxis, tf.newaxis],
        axis=0
    )
    heatmap = _normalize_heatmap(heatmap)

    result = heatmap.numpy()
    del conv_outputs, feature_maps, selected_maps, normalized_maps
    del resized_maps, channel_scores, weights, scores_per_channel
    return result
