
const plugin = new Plugin({
    name: "Package-Info"
});
  
const plugin_menu = new dropMenu({
	id:"git_package_info"
});

var git_package_config;
var git_package_error;

const pushGitPackageFile = function (repoUrl,cb) {
  if (!cb) return false;
  var req = new XMLHttpRequest();
  xn.open('get','https://raw.githubusercontent.com/'+url+'/master/package.json');
  xn.onload = function(res){
    cb(res.target);
  };
  xn.send();
  return true;
};

const showGitPackageInfo = function (opts) {
  if (!opts.repo) return;
  if (!opts.version) return;
  if (!opts.name) return;
  if (!opts.description) return;
  if (!opts.author) return;
  var content = (
    '<div style="padding:2px;">'+
    `<a>Name: ${opts.name}</a>`+
    `<br>`+
    `<a style="overflow-wrap: break-word;">Description: ${opts.description}</a>`+
    `<br>`+
    `<a style="color:rgb(200,240,210)">Version: ${opts.version}</a>`+
    `<br>`+
    `<a>Author: ${opts.author}</a>`+
    `<br><br>`+
    `<a style="color:rgb(200,200,200);" onclick='shell.openItem("https://github.com/${opts.repo}")'> Open in browser </a>`+
    '</div>'
    );
  new Dialog({
        id: 'git-package',
        title: `Git Package - ${opts.repo}`,
        content,
        buttons: {
          [getTranslation('Close')]: {}
        }
   })
};

const openFileName = function (filename,cb,throwError=false) {
  try {
    fs.readFile(filename, 'utf8', function (
      err,data
    ) {
      if (err) console.error(err);
      else cb(data);
    });
  } catch (e) {
    if (throwError) console.error(e);
  }
};

const getLocalPath = function () {
   if (!filepath) return;
  return path.join(filepath, '..\\.git\\');
};

const parseGitConfig = function (data) {
  var lines = data.split('\n');
  var config = {};
  for (var i in lines) {
    var l = lines[i].split('=');
    if (l.length > 1) {
      //key
      if (l[0][0]=='\t') l[0]=l[0].slice(1);
      else if (l[0][0]=='\t') l[0]=l[0].slice(1);
      if (l[0][l[0].length-1]==' ') l[0]=l[0].slice(0,-1);
      else if (l[0][l[0].length-1]=='\t') l[0]=l[0].slice(0,-1);
      //value
      if (l[1][0]=='\t') l[1]=l[1].slice(1);
      else if (l[1][0]==' ') l[1]=l[1].slice(1);
      if (l[1][l[0].length-1]==' ') l[1]=l[1].slice(0,-1);
      else if (l[1][l[0].length-1]=='\t') l[1]=l[1].slice(0,-1);
      config[l[0]]=l[1];
    }
  }
  return config;
};

const loadGitFiles = function () {
   if (git_package_error) {
     console.error(git_package_error);
     return;
   }
   var lpath = getLocalPath();
   if (!lpath) return;
   if (fs.existsSync(lpath+'config')) {
     	openFileName(lpath+'config',(config)=>{
          git_package_config = parseGitConfig(config);
        });
   } else {
     git_package_error = 'Git config file not found.';
     checkGitFiles();
   }
};

const mountPackageDetails = function() {
  if (git_package_error) return;
  if (!git_package_config.url) return;
  var repo = git_package_config.url.split('https://github.com/')[1];
  pushGitPackageFile(repo,(res)=>{
    if (res.status == 200) {
      try {
        var j = JSON.parse(res.responseText);
        j.repo = repo;
        showGitPackageInfo(j);
      } catch(e) {console.log(e);}
    }
  });
}

plugin_menu .setList({
  "button": "Package (GIT)",
  "list":{
     "Show package info":{
        click:()=> {
          if (git_package_error) return;
          mountPackageDetails();
          loadGitFiles();
        }
      }
  }
});
  
loadGitFiles();

