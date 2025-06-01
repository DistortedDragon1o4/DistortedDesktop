# # import os
# # import configparser
# # import json

# # def parse_desktop_file(file_path):
# #     config = configparser.ConfigParser(interpolation=None)  # Disable interpolation
# #     # configparser requires a [DEFAULT] section, so we add it manually
# #     with open(file_path, 'r', encoding='utf-8') as file:
# #         content = '[DEFAULT]\n' + file.read()

# #     config.read_string(content)

# #     # Extract the required fields
# #     app_name = config['Desktop Entry'].get('Name', '')
# #     app_icon = config['Desktop Entry'].get('Icon', '')
# #     app_exec = config['Desktop Entry'].get('Exec', '')

# #     return {
# #     	'Path': file_path,
# #         'Name': app_name,
# #         'Icon': app_icon,
# #         'Exec': app_exec
# #     }

# # def parse_desktop_files_in_directory(directory):
# #     apps = []
# #     for filename in os.listdir(directory):
# #         if filename.endswith('.desktop'):
# #             file_path = os.path.join(directory, filename)
# #             app_info = parse_desktop_file(file_path)
# #             apps.append(app_info)
# #     return apps

# # if __name__ == '__main__':
# #     directory = os.path.expanduser('~/.local/share/pinned')
# #     apps = parse_desktop_files_in_directory(directory)
# #     print(json.dumps(apps, indent=4))

# import json
# import argparse
# from configparser import ConfigParser

# def read_json(file_path):
#     """Read and return the content of a JSON file."""
#     try:
#         with open(file_path, 'r') as file:
#             return json.load(file)
#     except FileNotFoundError:
#         return []

# def write_json(file_path, data):
#     """Write data to a JSON file."""
#     with open(file_path, 'w') as file:
#         json.dump(data, file, indent=4)

# def parse_desktop_file(desktop_path):
#     """Parse a .desktop file and extract path, name, icon, and exec."""
#     # Create a ConfigParser object with interpolation disabled
#     config = ConfigParser(interpolation=None)

#     # Read the .desktop file as a string
#     with open(desktop_path, 'r') as file:
#         desktop_content = file.read()

#     # Read the content as a config
#     config.read_string(desktop_content)

#     entry = {
#         'path': desktop_path,
#         'name': config['Desktop Entry'].get('Name', ''),
#         'icon': config['Desktop Entry'].get('Icon', ''),
#         'exec': config['Desktop Entry'].get('Exec', '')
#     }
#     return entry

# def is_duplicate(data, new_entry):
#     """Check if an entry with the same path already exists in the data."""
#     return any(entry['path'] == new_entry['path'] for entry in data)

# def remove_entry_by_path(data, path):
#     """Remove an entry with the specified path from the data."""
#     initial_length = len(data)
#     data[:] = [entry for entry in data if entry['path'] != path]
#     return len(data) != initial_length  # Return True if an entry was removed

# def main():
#     parser = argparse.ArgumentParser(description="Manage .desktop file entries in a JSON file.")
#     parser.add_argument('json_file', help="Path to the JSON file.")
#     parser.add_argument('--add', help="Path to the .desktop file to add to the JSON.")
#     parser.add_argument('--remove', help="Path of the entry to remove from the JSON.")

#     args = parser.parse_args()

#     # Read the existing JSON data
#     data = read_json(args.json_file)

#     # If --add argument is provided, add the new .desktop file to the JSON
#     if args.add:
#         new_entry = parse_desktop_file(args.add)

#         # Check for duplicates based on path
#         if not is_duplicate(data, new_entry):
#             data.append(new_entry)
#             write_json(args.json_file, data)

#     # If --remove argument is provided, remove the entry with the specified path
#     if args.remove:
#         if remove_entry_by_path(data, args.remove):
#             write_json(args.json_file, data)

#     # Print only the updated JSON contents
#     print(json.dumps(data, indent=4))

# if __name__ == "__main__":
#     main()


import json
import argparse

def read_json(file_path):
    """Read and return the content of a JSON file."""
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def write_json(file_path, data):
    """Write data to a JSON file."""
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def is_duplicate(data, new_entry):
    """Check if an entry with the same path already exists in the data."""
    return any(entry['path'] == new_entry['path'] for entry in data)

def remove_entry_by_path(data, path):
    """Remove an entry with the specified path from the data."""
    initial_length = len(data)
    data[:] = [entry for entry in data if entry['path'] != path]
    return len(data) != initial_length  # Return True if an entry was removed

def main():
    parser = argparse.ArgumentParser(description="Manage entries in a JSON file.")
    parser.add_argument('json_file', help="Path to the JSON file.")

    # Add arguments for the entry fields
    parser.add_argument('--add', action='store_true', help="Add a new entry to the JSON.")
    parser.add_argument('--path', help="Path for the new entry.")
    parser.add_argument('--name', help="Name for the new entry.")
    parser.add_argument('--icon', help="Icon for the new entry.")

    parser.add_argument('--remove', help="Path of the entry to remove from the JSON.")

    args = parser.parse_args()

    # Read the existing JSON data
    data = read_json(args.json_file)

    # If --add argument is provided, create new entry from CLI arguments
    if args.add:
        if not all([args.path, args.name, args.icon]):
            print("Error: When using --add, you must provide --path, --name, and --icon")
            return

        new_entry = {
            'path': args.path,
            'name': args.name,
            'icon': args.icon,
        }

        # Check for duplicates based on path
        if not is_duplicate(data, new_entry):
            data.append(new_entry)
            write_json(args.json_file, data)

    # If --remove argument is provided, remove the entry with the specified path
    if args.remove:
        if remove_entry_by_path(data, args.remove):
            write_json(args.json_file, data)

    # Print the updated JSON contents
    print(json.dumps(data, indent=4))

if __name__ == "__main__":
    main()
