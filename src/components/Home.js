import React, { useState } from "react";

const Child = React.memo(props => {
  return <React.Fragment>{props.name}</React.Fragment>;
});
const Count = (props) => {

  return <h1>{props.count}</h1>;
};

const Home =((props) => {
  const [name, setName] = useState("React");
  const [count, setCount] = useState(1);
  const  handleClick = () => {
    let value = count + 1
    setCount(value)
  };
  return (
    <div className="max-w-sm m-auto mt-4 rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          Background : <Child name= {name}/>
        </div>
        <p className="text-gray-700 text-base">
         Count <Count count = {count}/>
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        onClick = {()=>handleClick()}
        >
         Click
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
      </div>
    </div>
  );
});
export default React.memo(Home);
