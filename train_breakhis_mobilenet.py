import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing import image_dataset_from_directory
import matplotlib.pyplot as plt

# === CONFIG ===
DATASET_DIR = r"C:\\Users\\hgmar\\Downloads\\archive\\BreaKHis_v1\\BreaKHis_v1\\histology_slides\\breast"
BATCH_SIZE = 32
IMG_SIZE = (224, 224)
EPOCHS = 10

# === LOAD DATA ===
print("Loading dataset...")
train_dataset = image_dataset_from_directory(
    DATASET_DIR,
    labels='inferred',
    label_mode='binary',  # binary classification
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    shuffle=True,
    validation_split=0.2,
    subset='training',
    seed=123
)

val_dataset = image_dataset_from_directory(
    DATASET_DIR,
    labels='inferred',
    label_mode='binary',
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    shuffle=True,
    validation_split=0.2,
    subset='validation',
    seed=123
)

# Prefetch for speed
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

# === BUILD MODEL ===
print("Building MobileNetV2 model...")
base_model = MobileNetV2(input_shape=IMG_SIZE + (3,),
                         include_top=False,
                         weights='imagenet')

base_model.trainable = False  # Freeze base model initially

# Use Functional API
inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = preprocess_input(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
outputs = layers.Dense(1, activation='sigmoid')(x)
model = models.Model(inputs, outputs)

# === COMPILE MODEL ===
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# === TRAIN MODEL ===
print("Training model...")
history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS
)

# === SAVE MODEL ===
model.save("breakhis_mobilenet_model.h5")
print("Model saved as breakhis_mobilenet_model.h5")

# === PLOT RESULTS ===
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']
epochs_range = range(EPOCHS)

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()
