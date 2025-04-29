import os
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing import image_dataset_from_directory
import matplotlib.pyplot as plt

# === CONFIG ===
DATASET_DIR = r"C:\\Users\\hgmar\\Downloads\\archive\\BreaKHis_v1\\BreaKHis_v1\\histology_slides\\breast"
BATCH_SIZE = 32
IMG_SIZE = (224, 224)
INITIAL_EPOCHS = 10
FINE_TUNE_EPOCHS = 5

# === LOAD DATA WITH AUGMENTATION ===
print("Loading dataset with augmentation...")

# Data augmentation pipeline
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip('horizontal'),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

train_dataset = image_dataset_from_directory(
    DATASET_DIR,
    labels='inferred',
    label_mode='binary',
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

# Apply data augmentation to the training set
train_dataset = train_dataset.map(lambda x, y: (data_augmentation(x, training=True), y))

# Prefetch for speed
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

# === BUILD MODEL ===
print("Building MobileNetV2 model...")
base_model = MobileNetV2(input_shape=IMG_SIZE + (3,),
                         include_top=False,
                         weights='imagenet')

base_model.trainable = False

# Use Functional API
inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = preprocess_input(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.2)(x)
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
    epochs=INITIAL_EPOCHS
)

# === FINE-TUNE THE MODEL ===
print("Fine-tuning model...")
base_model.trainable = True

# Recompile with a lower learning rate
model.compile(optimizer=optimizers.Adam(1e-5),  # very low learning rate
              loss='binary_crossentropy',
              metrics=['accuracy'])

fine_tune_history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=INITIAL_EPOCHS + FINE_TUNE_EPOCHS,
    initial_epoch=history.epoch[-1]
)

# === SAVE MODEL ===
model.save("breakhis_mobilenet_finetuned_model.keras")
print("Fine-tuned model saved as breakhis_mobilenet_finetuned_model.keras")

# === PLOT RESULTS ===
acc = history.history['accuracy'] + fine_tune_history.history['accuracy'][1:]
val_acc = history.history['val_accuracy'] + fine_tune_history.history['val_accuracy'][1:]
loss = history.history['loss'] + fine_tune_history.history['loss'][1:]
val_loss = history.history['val_loss'] + fine_tune_history.history['val_loss'][1:]
epochs_range = range(INITIAL_EPOCHS + FINE_TUNE_EPOCHS)

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
