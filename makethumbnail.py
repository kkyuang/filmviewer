import os
from PIL import Image

def create_thumbnails(base_path='data/films', thumbnail_base='data/thumbnails', target_width=480):
    # 모든 n 디렉토리에 대해 반복
    for folder_name in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder_name)

        # 디렉토리가 아닐 경우 건너뜀
        if not os.path.isdir(folder_path):
            continue

        # 썸네일 저장 경로
        thumbnail_path = os.path.join(thumbnail_base, folder_name)
        os.makedirs(thumbnail_path, exist_ok=True)

        # 이미지 파일들 처리
        for file_name in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file_name)

            # 이미지 파일이 아닐 경우 건너뜀
            if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                continue

            try:
                with Image.open(file_path) as img:
                    # 비율 유지하며 크기 조정
                    width_percent = target_width / float(img.width)
                    target_height = int(float(img.height) * width_percent)
                    resized_img = img.resize((target_width, target_height))

                    # 저장 경로
                    save_path = os.path.join(thumbnail_path, file_name)
                    resized_img.save(save_path)
                    print(f"Saved thumbnail: {save_path}")
            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

# 실행
create_thumbnails()
