import tensorflow as tf
import numpy as np


# ============================================================
# GRAD-CAM
# ============================================================

def generate_gradcam(model, img_array):

    # Get MobileNetV2 base model
    base_model = model.get_layer("mobilenetv2_1.00_224")

    # Last convolution layer
    last_conv_layer = base_model.get_layer("Conv_1")

    # Rebuild classifier
    classifier_input = tf.keras.Input(
        shape=last_conv_layer.output.shape[1:]
    )

    x = classifier_input
    x = model.get_layer("flatten")(x)
    x = model.get_layer("dropout")(x)
    x = model.get_layer("dense")(x)
    classifier_output = model.get_layer("dense_1")(x)

    classifier_model = tf.keras.Model(
        classifier_input,
        classifier_output
    )

    # Model from input image -> convolution output
    conv_model = tf.keras.Model(
        base_model.input,
        last_conv_layer.output
    )

    with tf.GradientTape() as tape:

        conv_outputs = conv_model(img_array)

        tape.watch(conv_outputs)

        predictions = classifier_model(
            conv_outputs,
            training=False
        )

        class_idx = tf.argmax(predictions[0])

        loss = predictions[:, class_idx]

    # Gradients
    grads = tape.gradient(
        loss,
        conv_outputs
    )

    # Mean gradients
    pooled_grads = tf.reduce_mean(
        grads,
        axis=(0, 1, 2)
    )

    conv_outputs = conv_outputs[0]

    # Weight feature maps
    heatmap = tf.reduce_sum(
        conv_outputs * pooled_grads,
        axis=-1
    )

    # ReLU
    heatmap = tf.maximum(
        heatmap,
        0
    )

    # Normalize
    heatmap = heatmap / (
        tf.reduce_max(heatmap) + 1e-8
    )

    return heatmap.numpy()


# ============================================================
# SCORE-CAM
# ============================================================

def generate_scorecam(
    model,
    img_array,
    max_channels=64
):
    """
    Memory-efficient Score-CAM.

    max_channels limits the number of activation maps used
    to reduce RAM usage on deployment servers such as Render.

    The highest-activation feature maps are selected first.
    """

    # --------------------------------------------------------
    # Get MobileNetV2
    # --------------------------------------------------------

    base_model = model.get_layer(
        "mobilenetv2_1.00_224"
    )

    # Last convolution layer
    last_conv_layer = base_model.get_layer(
        "Conv_1"
    )

    # --------------------------------------------------------
    # Create convolution model
    # --------------------------------------------------------

    conv_model = tf.keras.Model(
        base_model.input,
        last_conv_layer.output
    )

    # --------------------------------------------------------
    # Get activation maps
    # --------------------------------------------------------

    conv_outputs = conv_model(
        img_array,
        training=False
    )

    # Shape:
    # (1, height, width, channels)

    feature_maps = conv_outputs[0]

    # --------------------------------------------------------
    # Select strongest channels
    # --------------------------------------------------------

    channel_strength = tf.reduce_mean(
        tf.abs(feature_maps),
        axis=(0, 1)
    )

    number_of_channels = feature_maps.shape[-1]

    channels_to_use = min(
        max_channels,
        int(number_of_channels)
    )

    top_indices = tf.argsort(
        channel_strength,
        direction="DESCENDING"
    )[:channels_to_use]

    selected_maps = tf.gather(
        feature_maps,
        top_indices,
        axis=-1
    )

    # --------------------------------------------------------
    # Normalize activation maps
    # --------------------------------------------------------

    min_values = tf.reduce_min(
        selected_maps,
        axis=(0, 1),
        keepdims=True
    )

    max_values = tf.reduce_max(
        selected_maps,
        axis=(0, 1),
        keepdims=True
    )

    normalized_maps = (
        selected_maps - min_values
    ) / (
        max_values - min_values + 1e-8
    )

    # --------------------------------------------------------
    # Resize maps to input image size
    # --------------------------------------------------------

    input_height = img_array.shape[1]
    input_width = img_array.shape[2]

    resized_maps = tf.image.resize(
        tf.transpose(
            normalized_maps,
            [2, 0, 1]
        )[..., tf.newaxis],
        (input_height, input_width)
    )

    # Shape:
    # (channels, height, width, 1)

    resized_maps = tf.squeeze(
        resized_maps,
        axis=-1
    )

    # --------------------------------------------------------
    # Create masked images
    # --------------------------------------------------------

    image = img_array[0]

    masked_images = (
        image[tf.newaxis, ...]
        *
        resized_maps[..., tf.newaxis]
    )

    # --------------------------------------------------------
    # Predict masked images
    # --------------------------------------------------------

    # Rebuild classifier from convolution output
    classifier_input = tf.keras.Input(
        shape=last_conv_layer.output.shape[1:]
    )

    x = classifier_input

    x = model.get_layer("flatten")(x)
    x = model.get_layer("dropout")(x)
    x = model.get_layer("dense")(x)
    classifier_output = model.get_layer("dense_1")(x)

    classifier_model = tf.keras.Model(
        classifier_input,
        classifier_output
    )

    # Need convolution features for each masked image
    masked_conv_outputs = conv_model(
        masked_images,
        training=False
    )

    predictions = classifier_model(
        masked_conv_outputs,
        training=False
    )

    # --------------------------------------------------------
    # Convert output to probabilities
    # --------------------------------------------------------

    probabilities = tf.nn.softmax(
        predictions,
        axis=-1
    )

    # Original image prediction
    original_conv = conv_outputs

    original_prediction = classifier_model(
        original_conv,
        training=False
    )

    class_idx = tf.argmax(
        original_prediction[0]
    )

    # Score for predicted class
    scores = probabilities[
        :,
        class_idx
    ]

    # --------------------------------------------------------
    # Normalize Score-CAM weights
    # --------------------------------------------------------

    score_min = tf.reduce_min(scores)
    score_max = tf.reduce_max(scores)

    weights = (
        scores - score_min
    ) / (
        score_max - score_min + 1e-8
    )

    # --------------------------------------------------------
    # Weighted combination of activation maps
    # --------------------------------------------------------

    heatmap = tf.reduce_sum(
        resized_maps * weights[:, tf.newaxis, tf.newaxis],
        axis=0
    )

    # ReLU
    heatmap = tf.maximum(
        heatmap,
        0
    )

    # Normalize
    heatmap = heatmap / (
        tf.reduce_max(heatmap) + 1e-8
    )

    # --------------------------------------------------------
    # Cleanup
    # --------------------------------------------------------

    del masked_images
    del masked_conv_outputs
    del predictions
    del probabilities

    return heatmap.numpy()