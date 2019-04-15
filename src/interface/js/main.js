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
    {
        command: "relate",
        params: [{name: "typeid", type: "id"}, {name: "aid", type: "id"}, {name: "bid", type: "id"}]
    },
    {
        command: "reorder",
        params: [{name: "typeid", type: "id"}, {name: "aid", type: "id"}, {name: "oldpos", type: "pos"}, {name: "newpos", type: "pos"}]
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
        stack.unshift({
            result,
            query: current_command,
            args: params
        })
        console.log(stack);
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
                                class: p.type,
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
                stack.map(q=>{
                    let r = q.result
                    return m(".response",{
                        class: r.executed ? "": "error"
                    },[
                        m(".response__query",[
                            m(".response__query__name", q.query.command),
                            q.query.params.map((p)=>m(".response__query__arg", q.args[p.name]))
                        ]),

                        r.executed ? [
                            m(".response__id",{
                                onclick: e=>{
                                    if(current_command.params[0].type==="id"){
                                        params[current_command.params[0].name] = r.answer.id
                                    }
                                }
                            },r.answer.id),
                            m(".response__value",r.answer.value),
                            r.answer.relations ? r.answer.relations.map(rel=>{
                                return m(".response__relation", [
                                    m(".response__relation__key",[
                                        m(".response__relation__key__id", rel.key.id),
                                        m(".response__relation__key__value", rel.key.value),
                                    ]),
                                    m(".response__relation__values",[
                                        rel.values.map(v=>m(".response__relation__value",[
                                            m(".response__relation__value__id", v.id),
                                            m(".response__relation__value__value", v.value),
                                        ]))
                                    ])
                                ])

                                //return m(".response__relation", [
                                //    m(".response__relation__typeid", rel.type.id),
                                //    m(".response__relation__type",rel.type.value),
                                //    m("span",":"),
                                //    m(".response__relation__id",rel.other.id),
                                //    m(".response__relation__value",rel.other.value),
                                //])
                            }) : []
                        ] : [
                            m(".response__query",q.query),
                            r.error
                        ]

                    ])


                })
            ]),
        ])
    }
}

m.mount(document.body, App)
