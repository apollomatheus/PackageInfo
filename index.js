
const styleExtension = '.vue'; 
const plugin = new Plugin({
    name: "PluginTest"
});
  
const checkFileName = function () {
    const filename = filepath;
    var f = filename?filename.length>0?filename.split('\\'):null:null;
    if (f && f.length > 0) {
      f = f[f.length-1];
      if (f.split(styleExtension).length > 1) {
        return true;
      }
    }
    return false;
};

const formatCode = function () {
      if (!checkFileName()) return;
      fs.readFile(filepath,
          "utf8",
          function(err, data) {
              console.log(data);
          }
      );
};

async function loopTest() {
      const delay = setTimeout(() => {
        formatCode();
        await loopTest();
      },1000);
};

await loopTest();