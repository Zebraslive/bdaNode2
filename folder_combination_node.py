import os
from itertools import product
from PIL import Image

IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp'}
VIDEO_EXTS = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}
TEXT_EXTS = {'.txt', '.md'}


def _list_files(folder, exts):
    files = []
    if folder and os.path.isdir(folder):
        for name in sorted(os.listdir(folder)):
            if os.path.splitext(name)[1].lower() in exts:
                files.append(os.path.join(folder, name))
    return files


class FolderCombinationIterator:
    def __init__(self):
        self._index = 0
        self._last_input = None

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images_folder": ("STRING", {"default": ""}),
                "videos_folder": ("STRING", {"default": ""}),
                "texts_folder": ("STRING", {"default": ""}),
                "batch_index": ("INT", {"default": 0, "min": 0}),
            }
        }

    RETURN_TYPES = ("IMAGE", "STRING", "STRING", "INT", "INT")
    RETURN_NAMES = ("image", "video", "text", "next_index", "total_batches")
    FUNCTION = "get_batch"
    CATEGORY = "Loaders"

    def get_batch(self, images_folder, videos_folder, texts_folder, batch_index):
        images = _list_files(images_folder, IMAGE_EXTS)
        videos = _list_files(videos_folder, VIDEO_EXTS)
        texts = _list_files(texts_folder, TEXT_EXTS)

        if not images or not videos or not texts:
            raise ValueError("Each folder must contain at least one file")

        combos = list(product(images, videos, texts))
        total = len(combos)

        if self._last_input != batch_index:
            self._index = batch_index % total

        image_path, video_path, text_path = combos[self._index]

        with Image.open(image_path) as img:
            image = img.convert("RGB")

        with open(text_path, "r", encoding="utf-8") as f:
            text = f.read()

        self._index = (self._index + 1) % total
        self._last_input = batch_index

        return (image, video_path, text, self._index, total)


