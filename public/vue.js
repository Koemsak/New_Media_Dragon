
const PORT = 3000;
const URL_REQUEST = "http://localhost" + ":" + PORT;

new Vue ({
    el: "#app",
    data: {
        lists: [],
        author: "",
        isLogin: false,
        description: "",
        file: "",
        img: null,
        URL: URL_REQUEST,
        currentAuthor: "",
        updateDelete: true,
        getId: 0,
        getName: "",
        folderImg: [],
        getImg: "",
        discarded: false,
        action: "all",
    },
    methods: {
        discard() {
            this.img = "";
            this.file = "";
            this.discarded = false;
        },
        createClick: function() {
            this.description = "";
            this.updateDelete = true;
            this.img = "";
            this.discarded = false
        },
        userLogin: function() {
            this.isLogin = true;
            localStorage.setItem("author", this.author);
            localStorage.setItem("logined", this.isLogin);
            this.currentAuthor = localStorage.getItem("author");
            this.author = "";
        },
        userLogout: function() {
            this.isLogin = false;
            localStorage.setItem("logined", this.isLogin);
        },
        getImage() {
            this.discarded = true
            this.file = this.$refs.file.files[0];
            this.img = this.file.name;
            const formData = new FormData();
            formData.append("file", this.file);

            axios
                .post(this.URL + "/imgPost", formData)
                .then((res) => {

                })
                .catch((res) => {
                    console.log("error !")
                })
        },
        addInformation: function() {
            if (this.description !== "" || this.file !== "") {
                let author_name = localStorage.getItem("author");
                let today = new Date();
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                let date = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
                let time = today.getHours() + ":" + today.getMinutes();
                let dateTime = date + ", " + time;
                let text = this.description;

                let data = {
                    author: author_name,
                    date: dateTime,
                    description: text,
                    image: this.file,
                }
                axios.post(this.URL + "/posts", data).then((response) => {
                    this.lists = response.data;
                })
                .catch((error) => alert("This image is too large, You can't post this image"))
                this.updateDelete = true
                this.img = null
            }
            
        },
        deleteList() {
            let id = this.getId;
            this.updateDelete = true;
            axios.delete(this.URL + "/posts/" + id).then((response) => {
                this.lists = response.data;
            })
        },
        clickDelete(list) {
            this.getId = list.id;
        },
        editList(list) {
            this.updateDelete = false;
            this.getId = list.id;
            this.description = list.description; 
            this.getName = list.author;  
            this.img = list.image;
            if (list.image !== "") {
                this.discarded = true;
            }
        },
        updateList() {
            let today = new Date();
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            let date = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
            let time = today.getHours() + ":" + today.getMinutes();
            let dateTime = date + ", " + time;

            let id = this.getId;
            
            let new_inof = {
                id: id,
                author: this.getName,
                date: dateTime,
                description: this.description,
                image: this.file.name
            }
            axios.put(this.URL + "/posts/" + id, new_inof).then((response) => {
                this.lists = response.data;
            })
            .catch((error) => alert("This image is too large, You can't post this image"))
        },
        getStatus() {
            axios.get(this.URL + "/posts").then(response => {
                let datas = response.data;
                let statusData = [];
                for(let data of datas) {
                    if(data.image === "") {
                        statusData.push(data);
                    }
                }
                this.action = "status"
                this.lists = statusData
            })
        },
        getAll() {
            axios.get(this.URL + "/posts").then((response) => {
                this.lists = response.data;
            })
            this.action = "all"
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            if(this.action === "all") {
                this.getAll();
            } else if (this.action === "status") {
                this.getStatus();
            }
                
            this.currentAuthor = localStorage.getItem("author");
            this.isLogin = localStorage.getItem("logined")
        })


    }
})