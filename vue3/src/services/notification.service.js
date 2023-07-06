const NotificationService = {
    info(title = "Info", text = "This is info") {
        Toast.fire({
            icon: 'info', title: title,
        });
    },

    success(title = "Success", text = "This is info") {
        Toast.fire({
            icon: 'success', title: title,
        });
    },

    error(title = "Error", text = "This is info",) {
        Toast.fire({
            icon: 'error', title: title,
        });
    },
}

export default NotificationService;
