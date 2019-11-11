window.ToDoList = {

    API_URL: "http://localhost:8081/to-do-items",
    getItems: function () {
        $.ajax({
            url: ToDoList.API_URL,
            method: "GET"
        }).done(function (response) {
            console.log("GET done");
            console.log(response);
            ToDoList.displayItems(JSON.parse(response))
        });
    },
    createItem: function () {
        var requestBody = {};
        let description = $("#description-field").val();
        let deadline = $("#deadline-field").val();

        var request
        body = {
            description: descriptionValue,
            deadline: deadlineValue
        }
        $.ajax({
            url: ToDoList.API_URL,
            method: "POST",
            //MIME type
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            ToDoList.getItems();

        })

    }, displayItems: function (items) {
        var tableContent = "";
        items.forEach(item => tableContent += ToDoList.getItemTableRow(item));
        $("#to-do-items tbody").html(tableContent);
    },

    getItemTableRow: function (item) {
        //spread(...)
        var deadline = new Date(...item.deadline).toLocaleDateString("en");
        //ternary operator
        var checkedAttribute = item.done ? "checked" : "";
        return `<tr>
            <td>${item.description}</td>
            <td>${deadline}</td>
            <td><input type="checkbox" class="mark-done" data-id = "${item.id}" ${checkedAttribute}/></td>
            <td><a href="#" class="delete-item" data-id = "${item.id}">
                <i class="fas fa-recycle"></i></a> </td>
        </tr>`
    }
    ,
    bindEvents: function () {
        $("#create-item-from").submit(function (event) {
            event.preventDefault();
            ToDoList.createItem();

        });
    },
    markItemDone: function (id, done) {
        let requestBody = {
            done: done
        };
        $.ajax({
            url: ToDoList.API_URL + "?id = " + id,
            method: "PUT",
            contentType: "application?json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            ToDoList.createItem();
        });

        //delegate is necessary cause our checkbox is dinamically injected in the page (not preasent from the
        //begining  on the page load)

        $("#to-do-items").delegate(".mark-done", "change", function (event) {
            even.preventDefault();
            $(this).data("id");
            let id = $(this).data("id");
            let checked = $(this).is(":checked");
            ToDoList.markItemDone(id, checked);
        });
    },
    deleteItem: function (id, done) {
        let requestBody = {
            done: done
        };
        $.ajax({
            url: ToDoList.API_URL + "?id = " + id,
            method: "DELETE",
        }).done(function () {
            ToDoList.createItem();
        });
        $("#to-do-items").delegate(".delete-item", "change", function (event) {
            even.preventDefault();
            $(this).data("id");
            let id = $(this).data("id");
            ToDoList.deleteItem(id, checked);
        });
    },
}

ToDoList.getItems();
ToDoList.bindEvents();