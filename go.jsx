var Board = React.createClass({
    render: function() {
        return (<svg className="board" height="500" width="500">{this.props.children}</svg>);
    }
});

var Piece = React.createClass({
    render: function() {
        return (<circle className={"piece " + this.props.color}></circle>);
    }
});

React.render(<Board/></Board>, document.getElementById('content'));

