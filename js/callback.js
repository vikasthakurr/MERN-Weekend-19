// function sayHi(cb) {
//   setTimeout(() => {
//     console.log("hi");
//     cb();
//   }, 8000);
// }

// function bye(cb) {
//   console.log("bye");
// }

// sayHi(bye);

// sayHi();
// bye();

// callback-> call+later

function makeMagii(rawMagii, cb) {
  console.log("maggii aagya he");
  cb();
}

function waterBoil(cb) {
  console.log("pani ubal dia he");
  cb();
}

function addMasala(cb) {
  console.log("masala dal dia he");
  cb();
}

function serving(cb) {
  console.log("maggi serve kr di he");
  cb();
}

makeMagii("ata maggi", () => {
  waterBoil(() => {
    addMasala(() => {
      serving(() => {
        console.log("magii ka kam khtm");
      });
    });
  });
});
