$("#modifica_testo").click(function (evt) {
    if ($("#testo_ri").val() !== "" && testo === "nulla") {

        testo_nuovo = { ricetta: sessionStorage.getItem("nome_file"), testone: $("#testo_ri").val() };

        $.ajax({
            url: 'inserisci_testo.php',
            type: 'POST',
            async: false,
            data: testo_nuovo,
            success: function () {
                location.reload();
            },
            error: function () {
                alert("qualcosa è andato storto");
            }
        });
    }else if($("#testo_ri").val() === "" && testo === "nulla"){

    }else if($("#testo_ri").val() === "" && testo !== "nulla"){

        dove_cancellare = {ricetta: sessionStorage.getItem("nome_file")}

        $.ajax({
            url: 'cancella_testo.php',
            type: 'POST',
            async: false,
            data: dove_cancellare,
            success: function () {
                location.reload();
            },
            error: function () {
                alert("qualcosa è andato storto");
            }
        });

    }else{
        testo_nuovo = { ricetta: sessionStorage.getItem("nome_file"), testone: $("#testo_ri").val() };

        $.ajax({
            url: 'modifica_testo.php',
            type: 'POST',
            async: false,
            data: testo_nuovo,
            success: function () {
                location.reload();
            },
            error: function () {
                alert("qualcosa è andato storto");
            }
        });
    }
});