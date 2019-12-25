import * as core from '@actions/core';
import Client from 'ali-oss';
import glob from 'glob';
import path from 'path';

export async function upload(): Promise<void> {
  try {
    // process.env.REGION
    // process.env.ACCESS_KEY_ID
    // process.env.ACCESS_KEY_SECRET
    // process.env.BUCKET
    // ali-oss options
    const region =
      core.getInput('region', { required: false }) || process.env.REGION;
    const accessKeyId =
      core.getInput('accessKeyId', { required: false }) ||
      process.env.ACCESS_KEY_ID;
    const accessKeySecret =
      core.getInput('accessKeySecret', { required: false }) ||
      process.env.ACCESS_KEY_SECRET;
    const bucket =
      core.getInput('bucket', { required: false }) || process.env.BUCKET;
    const aclType = core.getInput('aclType', { required: false });
    // upload options
    const pattern = core.getInput('pattern', { required: true });
    const overwrite =
      core.getInput('overwrite', { required: false }) !== 'false';
    const fromDir = core.getInput('fromDir', { required: false }) || '.';
    const toDir = core.getInput('toDir', { required: false }) || '.';

    const client = new Client({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    });

    const files = glob.sync(pattern, { cwd: fromDir });
    for (const file of files) {
      let shouldUpload = true;
      if (!overwrite) {
        try {
          const result = await client.get(file);
          if (result.res.status !== 200) {
            shouldUpload = false;
          }
        } catch (error) {
          //
        }
      }
      if (shouldUpload) {
        try {
          //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
          const objectName = path.join(toDir, file);
          await client.put(objectName, path.join(fromDir, file));
          if (aclType != null) {
            // 管理文件访问权限
            await client.putACL(objectName, aclType);
          }
        } catch (e) {
          //
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}