class ApiResponse {
    constructor (statusCode, data, messaage = "success") {
        this.statusCode = statusCode
        this.data = data
        this.messaage = messaage
        this.success = statusCode < 400
    }
}

export {ApiResponse}