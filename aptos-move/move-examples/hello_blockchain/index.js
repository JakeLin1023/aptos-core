const { default: axios } = require("axios");
const { exec } = require("child_process");

// fs.readFile('./build/Examples/bytecode_modules/message.mv', 'binary', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(Buffer.from(data).toString('hex'))
// })

exec('aptos move compile --named-addresses hello_blockchain=939c57340d3d2326da3bd2fe653b6315001af3fb33d4506def3afd87a61c7b05', (err, stdout) => {
  if (err) {
    console.log('error', err)
    return;
  }
  exec('aptos move publish --named-addresses hello_blockchain=939c57340d3d2326da3bd2fe653b6315001af3fb33d4506def3afd87a61c7b05', (err, stdout, sterr) => {
    if (err) {
      console.log('error', err)
      return;
    }
    const versionString = stdout.split('"version":')[1];
    const version = Number(versionString.split(',')[0]);
    console.log('stdout', version)
    axios({ url: `https://fullnode.devnet.aptoslabs.com/v1/transactions/by_version/${version}` }).then(res => {
      exec('xxd -p ./build/Examples/bytecode_modules/message.mv', (err, hex) => {
        const bytecode = res.data.changes[0].data.bytecode;
        const toVerifyCode = `0x${hex}`.replace(/[\r\n]/g, '')
        console.log('hex', toVerifyCode)
        console.log('res', res.data.changes[0].data.bytecode)
        console.log(toVerifyCode === bytecode)
      })
    }).catch(err => {
      console.log('err', err)
    })
  })
})