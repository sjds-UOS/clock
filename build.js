// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
const packager = require("electron-packager");
// 毎回オプションを書き直すのは面倒くさいのでpackage.jsonから引っ張ってくる
const package = require("./package.json");

packager({
    name: package["name"],
    dir: ".",// ソースフォルダのパス
    out: "./release",// 出力先フォルダのパス
    icon: "./icon.ico",// アイコンのパス
    platform: "linux",
    arch: "x64",
    overwrite: true,// 上書き
    asar: false,// asarパッケージ化
    "app-version": package["version"],// アプリバージョン
    "app-copyright": "Copyright (C) 2016 "+package["author"]+".",// コピーライト
    tmpdir: false,
    ignore: ["node_modules/electron-*"],
    prune: true,
    "version-string": {// Windowsのみのオプション
        CompanyName: "x",
        FileDescription: package["name"],
        OriginalFilename: package["name"]+".exe",
        ProductName: package["name"],
        InternalName: package["name"]
    }
    
}, function (err, appPaths) {// 完了時のコールバック
    if (err) console.log(err);
    console.log("Done: " + appPaths);
});