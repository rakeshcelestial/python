def load_env(filename):
    env_dict = {}
    
    with open(filename, "r") as file:
        for line in file:
            line = line.strip()
            
            if not line or line.startswith("#"):
                continue
            
            key, value = line.split("=", 1)
            env_dict[key] = value
    
    return env_dict


env = load_env(r"C:\Users\rakesh.p\Desktop\Py files\Environment Variables\.env")
print(env)