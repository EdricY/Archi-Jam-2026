import os
import shutil
import sys

# TODO: should switch to using "Build APWorld" script from Archipelago Launcher

def zip_directories_with_custom_names(directory, output_file, output_dir="."):
    os.makedirs(output_dir, exist_ok=True)

    d = os.path.abspath(directory)
    parent = os.path.dirname(d)
    folder_name = os.path.basename(d)

    # shutil requires a base name without any extension
    temp_zip_base = os.path.join(output_dir, "_temp_zip_" + folder_name)

    # create standard .zip file
    temp_zip_path = shutil.make_archive(
        base_name=temp_zip_base,
        format="zip",
        root_dir=parent,
        base_dir=folder_name
    )

    # rename it
    final_path = os.path.join(output_dir, output_file)
    os.replace(temp_zip_path, final_path)

    print(f"Created {final_path}")

zip_directories_with_custom_names("heist-jam", f"heist-jam.apworld", output_dir="dist")

customworlddir = "C:\\ProgramData\\Archipelago\\custom_worlds"
shutil.copy(f"dist/heist-jam.apworld", customworlddir)