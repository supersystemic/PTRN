const m = require("mithril")





let commands = [
    {
        command: "declare",
        params: []
    },
    {
        command: "set_value",
        params: [{name: "id", type: "id"}, {name: "value", type: "text"}]
    }
]

let current_command = commands[0]

let stack = []

function request(){
    m.request({
        method: "POST",
        url: "http://localhost:3000/",
        data: {query: current_command.command}
    })
    .then(function(result) {
        stack.unshift(result)
    })
}

let App = {
    view: function() {
        return m("main", [
            m(".query",[
                m("select",{
                    onchange: e=> {
                        console.log(e.target.selectedIndex);
                        current_command = commands[e.target.selectedIndex]
                    }
                },[
                    commands.map(c=>m("option", c.command))
                ]),
                m(".params",[
                    current_command.params.map(p=>{
                        return m(".param", p.name)
                    })
                ]),
                m("button",{
                    onclick: e=> request()
                },"run")
            ]),
            m(".responses",[
                stack.map(r=>m(".response",r.id))
            ]),
        ])
    }
}

m.mount(document.body, App)
