const m = require("mithril")





let commands = [
    {
        command: "declare",
        params: []
    },
    {
        command: "set_value",
        params: [{name: "id", type: "id"}, {name: "value", type: "text"}]
    },
    {
        command: "get",
        params: [{name: "id", type: "id"}]
    },
]

let current_command = commands[0]
let params = {}

let stack = []

function request(){
    m.request({
        method: "POST",
        url: "http://localhost:3000/",
        data: {
            query: current_command.command,
            args: params
        }
    })
    .then(function(result) {
        stack.unshift(result)
        params = {}
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
                        return m(".param", [
                            m(".param__name",p.name),
                            m("input.param__value",{
                                value: params[p.name] || "",
                                oninput: e=> params[p.name] = e.target.value
                            })
                        ])
                    })
                ]),
                m("button",{
                    onclick: e=> request()
                },"run")
            ]),
            m(".responses",[
                stack.map(r=>m(".response",[
                    m(".response__id",{
                        onclick: e=>{
                            if(current_command.params[0].type==="id"){
                                params[current_command.params[0].name] = r.id
                            }
                        }
                    },r.id),
                    m(".response__value",r.value),
                ]))
            ]),
        ])
    }
}

m.mount(document.body, App)
