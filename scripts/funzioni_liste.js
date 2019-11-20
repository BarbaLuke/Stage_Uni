

function ricerca() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    table = document.getElementById("lista-globali");
    tr = table.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0];
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

var ingredienti_globali =
    JSON.parse(sessionStorage.getItem("ingredienti_global"));

document.getElementById("scarico").href = "ricette/" +
    sessionStorage.getItem("nome_file");

document.getElementById("leggo").href = "ricette/" +
    sessionStorage.getItem("nome_file");

var lista = document.getElementById("lista-globali");

for (a = 0; a < ingredienti_globali.length; a++) {
    let inni = "";
    if (ingredienti_globali[a].immagine !== "") {

        inni += "<tr> <td>" + ingredienti_globali[a].nome + "</td> <td> <a href='" + ingredienti_globali[a].immagine + "' target='_blank'> visualizza immagine </a></td> <td><button id='" + ingredienti_globali[a].nome +
            "' class='btn-warning btn btn-sm shadow-sm moda_imm'>\n\
<i class='fas fa-edit'></i></button></td></tr>";

    } else {

        inni += "<tr> <td>" + ingredienti_globali[a].nome + "</td> <td></td> <td><button id='" + ingredienti_globali[a].nome +
            "_' class='btn-primary shadow-sm btn btn-sm insert_imm'>\n\
<i class='fas fa-plus'></i></button></td></tr>";

    }
    lista.innerHTML += inni;
}

$(".insert_imm").click(function (evt) {
    let ins_imm = true;
    $('#insert_immagine').modal({
        show: true
    });
    var nome_glob = $(this).attr("id").split("_")[0];

    $("#salva_insert_link_imm").click(function (ev) {
        if (ins_imm === true) {
            let insero = { nome: nome_glob, immagine: $("#link_immagine").val() };
            for (b = 0; b < ingredienti_globali.length; b++) {

                if (ingredienti_globali[b].nome === nome_glob) {

                    ingredienti_globali[b].immagine = $("#link_immagine").val();
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
            $.ajax({
                url: 'aggiungi_modifica_immagine.php',
                type: 'POST',
                data: insero,
                success: function () {
                    location.reload();
                },
                error: function () {
                    alert("qualcosa è andato storto");
                }
            });
            ins_imm = false;
            $("#link_immagine").val("");
        }
    });

    $("#annulla_insert_link_imm").click(function (ev) {
        ins_imm = false;
        $("#link_immagine").val("");
    });
    $(".close").click(function (evw) {
        ins_imm = false;
        $("#link_immagine").val("");
    });
});

$(".moda_imm").click(function (evt) {
    let ins_imm = true;
    let imma;
    var nome_glob = $(this).attr("id");
    for (b = 0; b < ingredienti_globali.length; b++) {

        if (ingredienti_globali[b].nome === nome_glob) {

            imma = ingredienti_globali[b].immagine;
        }
    }

    $('#moda_immagine').modal({
        show: true
    });

    $("#link_immagine_mod").val(imma);

    $("#salva_moda_link_imm").click(function (ev) {
        if (ins_imm === true) {
            let insero = { nome: nome_glob, immagine: $("#link_immagine_mod").val() };
            for (b = 0; b < ingredienti_globali.length; b++) {

                if (ingredienti_globali[b].nome === nome_glob) {

                    ingredienti_globali[b].immagine = $("#link_immagine_mod").val();
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
            $.ajax({
                url: 'aggiungi_modifica_immagine.php',
                type: 'POST',
                data: insero,
                success: function () {
                    location.reload();
                },
                error: function () {
                    alert("qualcosa è andato storto");
                }
            });
            ins_imm = false;
            $("#link_immagine_mod").val("");
        }
    });

    $("#annulla_moda_link_imm").click(function (ev) {
        ins_imm = false;
        $("#link_immagine_mod").val("");
    });
    $(".close").click(function (evw) {
        ins_imm = false;
        $("#link_immagine_mod").val("");
    });
});