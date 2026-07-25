import tensorflow as tf
import numpy as np

def generate_gradcam(model, img_array):

    # Get MobileNetV2 base model
    base_model = model.get_layer("mobilenetv2_1.00_224")

    # Last convolution layer
    last_conv_layer = base_model.get_layer("Conv_1")

    # Rebuild classifier part manually
    classifier_input = tf.keras.Input(shape=last_conv_layer.output.shape[1:])

    x = classifier_input

    # Sequential top layers
    x = model.get_layer("flatten")(x)
    x = model.get_layer("dropout")(x)
    x = model.get_layer("dense")(x)
    classifier_output = model.get_layer("dense_1")(x)

    classifier_model = tf.keras.Model(
        classifier_input,
        classifier_output
    )

    with tf.GradientTape() as tape:

        # Forward pass through base model
        conv_outputs = tf.keras.Model(
            base_model.input,
            last_conv_layer.output
        )(img_array)

        tape.watch(conv_outputs)

        # Forward pass through classifier
        predictions = classifier_model(conv_outputs)

        class_idx = tf.argmax(predictions[0])

        loss = predictions[:, class_idx]

    # Gradients
    grads = tape.gradient(loss, conv_outputs)

    # Mean gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]

    # Weight channels
    heatmap = tf.reduce_sum(
        conv_outputs * pooled_grads,
        axis=-1
    )

    # ReLU
    heatmap = tf.maximum(heatmap, 0)

    # Normalize
    heatmap = heatmap / (tf.reduce_max(heatmap) + 1e-8)

    return heatmap.numpy()