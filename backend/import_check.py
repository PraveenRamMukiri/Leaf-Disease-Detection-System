import importlib, traceback, sys, os
print('cwd:', os.getcwd())
print('sys.path[0]:', sys.path[0])
print('sys.path[:5]:', sys.path[:5])
for mod in ('server', 'app.backend.server'):
    print('\n--- trying', mod)
    try:
        importlib.import_module(mod)
        print('import OK:', mod)
    except Exception:
        print('import failed:', mod)
        traceback.print_exc()
