import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

function printDocument(elements) {

    let doc = new jsPDF('p', 'mm', 'a4', true);


    let docs = elements.map(element => (
        new Promise( (resolve, reject) => {
            const input = document.getElementById(element);
            let x = 0, y = 0;
            html2canvas(
                input,
                {
                    scrollX: -window.scrollX,
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight,
                }
            )
                .then((canvas) => {
                    console.log(canvas)
                    let myImg = new Image();
                    myImg.src = canvas.toDataURL('image/png', 1);
                    // myImg.src = imgData;
                    let imgWidth = 210;
                    let pageHeight = 295;
                    let imgHeight = Math.ceil(canvas.height * imgWidth / canvas.width);
                    let heightLeft = imgHeight;

                    myImg.onload = function () {

                        doc.addImage(myImg, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
                        heightLeft -= pageHeight;

                        while (heightLeft >= 0) {
                            y = heightLeft - imgHeight;
                            doc.addPage();

                            doc.addImage(myImg, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
                            heightLeft -= pageHeight;
                        }
                        resolve(doc)
                    }

                })

            //.catch((err) => reject(err))
        })
    ))

    return new Promise((resolve, reject) => {
        Promise.all(docs)
            .then(docs => resolve(docs[2].save('document.pdf')))
    })




}

function exportToDoc(element) {
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";

    var footer = "</body></html>";

    var html = header + document.getElementById(element).innerHTML + footer;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    let filename = 'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}

export {exportToDoc, printDocument}