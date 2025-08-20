# Folder Combination Iterator Node

This repository provides a custom [ComfyUI](https://github.com/comfyanonymous/ComfyUI) node that iterates over all
combinations of images, videos and text prompts found in three folders.

## Node Outputs
- `image`: selected image file path
- `video`: selected video file path
- `text`: text file contents
- `next_index`: index for the next batch
- `total_batches`: total number of combinations

Provide the current `batch_index` to select a batch. Feed `next_index` back into
`batch_index` to iterate through all batches.
