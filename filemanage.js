#!/usr/bin/env node
 let fs=require('fs');
let path=require('path');
//let helpobj=require('.\help.js');
//language gives you logic ,framework gives you feature
let types = {
    media: ["mp4", "mkv","jpg","jpeg","PNG","JPG","png"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
let inputarr=process.argv.slice(2);
console.log(inputarr);
//node filemanage.js tree "directorypath"
//node filemanage.js organize"directorypath"
//node filemanage.js help
let destpath;
let command=inputarr[0];
switch(command){
    case "tree":
        treefn(inputarr[1])
    break;

    case "organize":
        organizefn(inputarr[1])
        break;

        case "help":
         helpfn();
            break;

            default:
                console.log("please input right commands");
}
function treefn(dirpath){
    if(dirpath==undefined){
        treehelper(process.cwd(), "");
        return;
          }else{
              let doesexist=fs.existsSync(dirpath);
              if(doesexist){
                
                  treehelper(dirpath,"");//empty string here is for indentation 
              }else{
                  console.log("kindly enter correct path");
                    return;
              }
          }
console.log("tree command implemented for ",dirpath);
}
 
function treehelper(dirpath , indent){
     //1 is file (print as it is)or folder
     let IsFile=fs.lstatSync(dirpath).isFile();
     if(IsFile==true){
        let filename= path.basename(dirpath);
        console.log(indent+"├──"+filename);
     }else{
         let dirname=path.basename(dirpath)
       console.log(indent+"└──"+dirname);
      let childrens= fs.readdirSync(dirpath);
       for(let i=0;i<childrens.length;i++){// recursion
        let childaddress=path.join(dirpath,childrens[i]);
        treehelper(childaddress,indent+"\t");
       }
     }
     
}



//organize function
function organizefn(dirpath){
   //1 input -->directory path
   if(dirpath==undefined){
    destpath = process.cwd();
 return;
   }else{
       let doesexist=fs.existsSync(dirpath);
       if(doesexist){
           //2.create-->organized-files-->directory
            destpath=path.join(dirpath, "organized_files");
           if(fs.existsSync(destpath)==false){
               fs.mkdirSync(destpath)
           } 
       }else{
           console.log("kindly enter correct path");
             return;
       }
   }
     organizehelper(dirpath,destpath);
    console.log("organize command implemented for ",dirpath);
    }
    function organizehelper(src,destpath){
// 3 identify  categories of all the files present in that input directory
     let childname=fs.readdirSync(src);
     //console.log(childname);
     for(let i=0;i<childname.length;i++){
         let childAddress=path.join(src,childname[i]);
         let IsFile=fs.lstatSync(childAddress).isFile();
         if(IsFile){
             //console.log(childname[i]);
             // 4 copy/cut  files to that organised directory inside of any of category folder
             let category=getCategory(childname[i]);
             console.log(childname[i],"belongs to ",category);
              sendFiles(childAddress,destpath,category); 
            }

     }
    }

    function getCategory(name){
        let ext=path.extname(name);
        ext=ext.slice(1);
      //  console.log(ext);
      for(let type in types){
         let ctypearr= types[type];
         for( let i=0;i<ctypearr.length;i++){
             if(ext==ctypearr[i]){
                 return type;
             }
         }
      }
      return "others"
    }
    function sendFiles(srcfile,dest,category){
        //
        let categorypath=path.join(dest,category);
        if(fs.existsSync(categorypath)==false){
            fs.mkdirSync(categorypath);
        }
      let filename=  path.basename(srcfile);
      let destfilepath=path.join(categorypath,filename);
      fs.copyFileSync(srcfile,destfilepath);
      console.log(filename," copied to ",category);
      fs.unlinkSync(srcfile);
    }

    //help fn
    function helpfn(){
        console.log(`
         List of all the commands:
             node filemanage.js tree "directorypath"
             node filemanage.js organize "directorypath"
             node filemanage.js help
        `);
        }
    