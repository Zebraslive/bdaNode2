# Folder Combination Iterator Node

This repository provides a custom [ComfyUI](https://github.com/comfyanonymous/ComfyUI) node that iterates over all
combinations of images, videos and text prompts found in three folders.

## Installation

1. Change into your ComfyUI `custom_nodes` directory:
   ```bash
   cd /path/to/ComfyUI/custom_nodes
   ```
2. Clone this repository and install requirements:
   ```bash
   git clone https://example.com/folder-combination-iterator.git
   cd folder-combination-iterator
   pip install -r requirements.txt  # no extra packages needed
   ```

Your `custom_nodes` directory should end up with a structure like:

```
ComfyUI/
└── custom_nodes/
    └── folder-combination-iterator/
        ├── __init__.py
        ├── folder_combination_node.py
        ├── requirements.txt
        └── README.md
```

## Node Outputs
- `image`: selected image file path
- `video`: selected video file path
- `text`: text file contents
- `next_index`: index for the next batch
- `total_batches`: total number of combinations
The `batch_index` input sets the starting batch. After the first run, the
iterator automatically advances the index by one on each execution. Adjust the
`batch_index` input to reset or jump to a different position.
