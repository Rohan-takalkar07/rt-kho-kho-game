import os

def cleanup_repo(root_dir):
    # 1. Remove empty files
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath.split(os.sep) or '.git' in dirpath.split(os.sep):
            continue
            
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            try:
                size = os.path.getsize(filepath)
                if size == 0:
                    print(f"Removing empty file: {filepath}")
                    os.remove(filepath)
                else:
                    with open(filepath, 'rb') as f:
                        if not f.read().strip():
                            print(f"Removing empty file (whitespace): {filepath}")
                            os.remove(filepath)
            except Exception as e:
                print(f"Error checking/removing {filepath}: {e}")

    # 2. Remove empty directories (bottom-up)
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        if 'node_modules' in dirpath.split(os.sep) or '.git' in dirpath.split(os.sep):
            continue
            
        # Refetch contents because we might have deleted files
        if not os.listdir(dirpath):
            print(f"Removing empty directory: {dirpath}")
            try:
                os.rmdir(dirpath)
            except Exception as e:
                print(f"Error removing directory {dirpath}: {e}")

if __name__ == "__main__":
    cleanup_repo(".")
