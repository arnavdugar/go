board_width = 700;
board_height = 700;
grid_size = 19;

var Board = React.createClass({
    getInitialState: function() {
        var state = {};
        for(var i = 0; i < grid_size * grid_size; i++) {
            state[i] = 0;
        }
        return state;
    },
    render: function() {
        var pieces = [];
        for(var x = 0; x < grid_size; x++) {
            for(var y = 0; y < grid_size; y++) {
                var index = grid_size * y + x;
                if(this.state[index] == 0) {
                    var color = "none";
                } else if(this.state[index] == 1) {
                    var color = "white";
                } else if(this.state[index] == 2) {
                    var color = "black";
                }
                var piece = <Piece key={"p" + index} x={x} y={y} color={color}/>;
                pieces.push(piece);
            }
        }
        var lines = [];
        for(var i = 0; i < grid_size; i++) {
            var y = board_width * (i + 0.5) / grid_size;
            lines.push(<line key={"y" + i} className="grid" x1="0" x2={board_width} y1={y} y2={y}/>);
        }
        for(var i = 0; i < grid_size; i++) {
            var x = board_height * (i + 0.5) / grid_size;
            lines.push(<line key={"x" + i} className="grid" x1={x} x2={x} y1="0" y2={board_height}/>);
        }
        return (
            <svg className="board" height={board_width} width={board_height}>
                {lines}{pieces}
            </svg>
        );
    }
});

var Piece = React.createClass({
    render: function() {
        var x = board_width * (this.props.x + 0.5) / grid_size;
        var y = board_width * (this.props.y + 0.5) / grid_size;
        return (<circle className={"piece " + this.props.color} cx={x} cy={y} onClick={this.onClick}></circle>);
    },
    onClick: function(event) {
        clickHandler(event, this);
    }
});

React.render(<Board/>, document.getElementById('content'));

function clickHandler(event, target) {
    console.log("Clicked x = " + target.props.x + ", y = " + target.props.y + ".");
}

