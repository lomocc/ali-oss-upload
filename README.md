# Ali OSS Upload

Upload files to Aliyun OSS

## Usage:

```yaml
- name: Upload Release Asset
  uses: lomocc/ali-oss-upload@master
  env:
    REGION: ${{ secrets.REGION }} # ali-oss options orgin
    ACCESS_KEY_ID: ${{ secrets.ACCESS_KEY_ID }} # ali-oss options accessKeyId
    ACCESS_KEY_SECRET: ${{ secrets.ACCESS_KEY_SECRET }} # ali-oss options accessKeySecret
    BUCKET: ${{ secrets.BUCKET }} # ali-oss options bucket
  with:
    pattern: GXWorkSetup*{.exe,.dmg} # dist/GXWorkSetup*{.exe,.dmg}
    cwd: dist
    ossBaseDir: gxwork
```
