import os
import re
import subprocess


for subdir, dirs, files in os.walk(r'.'):
    for filename in files:
        filepath = subdir + os.sep + filename
        filepath_send = re.sub(r'^\.', '', filepath) 

        print (filepath + " - " + filepath_send)

        if re.search(r'(\.js)', filename):
            object_cmd = (
                f'neofs-cli -r st1.storage.fs.neo.org:8080 --wif PRIV_KEY_HERE '
                f'object put --cid NEW_CID_HERE --file {filepath} --attributes FilePath={filepath_send},X-Content-Type=application/javascript,Content-Type=application/javascript'
            )
        elif re.search(r'(\.svg)', filename):
            object_cmd = (
                f'neofs-cli -r st1.storage.fs.neo.org:8080 --wif PRIV_KEY_HERE '
                f'object put --cid NEW_CID_HERE --file {filepath} --attributes FilePath={filepath_send},X-Content-Type=image/svg+xml,Content-Type=image/svg+xml'
            )
        elif re.search(r'(\.css)', filename):
            object_cmd = (
                f'neofs-cli -r st1.storage.fs.neo.org:8080 --wif PRIV_KEY_HERE '
                f'object put --cid NEW_CID_HERE --file {filepath} --attributes FilePath={filepath_send},X-Content-Type=text/css,Content-Type=text/css'
            )
        else:
            object_cmd = (
                f'neofs-cli -r st1.storage.fs.neo.org:8080 --wif PRIV_KEY_HERE '
                f'object put --cid NEW_CID_HERE --file {filepath} --attributes FilePath={filepath_send}'
            )


        print("Cmd: %s" % object_cmd)
        
        try:
            complProc = subprocess.run(object_cmd, check=True, universal_newlines=True,
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=15, shell=True)

            print("Output: %s" % complProc.stdout)

        except subprocess.CalledProcessError as e:
            raise Exception("command '{}' return with error (code {}): {}".format(e.cmd, e.returncode, e.output))
