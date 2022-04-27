import React, { useEffect ,useState ,Component } from 'react'
import './App.css'

const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
}

const App = () => {

  const [allPokemons ,setAllPokemons] = useState({})
  const [myPokemons ,setMyPokemons] = useState([])

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const [errors, setErrors ] =useState(false)



  const handleRemoveCharacter= (e) => {
    const name = e.target.getAttribute("name")
    const data =myPokemons.filter(item => item.name == name)
    setAllPokemons( oldPoke=> [...oldPoke,data[0]])
    setMyPokemons(myPokemons.filter(item => item.name !== name));
   };

  const handleAddCharacter = (e) => {
    const name = e.target.getAttribute("name")
    const data =allPokemons.filter(item => item.name == name)
    setMyPokemons( oldPoke=> [...oldPoke,data[0]])
    setAllPokemons(allPokemons.filter(item => item.name !== name));
    setFilteredResults( filteredResults.filter(item => item.name !== name));
   };

  function addData(data) {
    var newData = []

    for (let i = 0; i < data.length; i++) {
      const element={}

      element.id    = data[i].id;
      element.name  = data[i].name;
      element.imageUrl  = data[i].imageUrl;

      element.hp    = data[i].hp;
      if (element.hp>100){
        element.hp=100
      };

      
      if(data[i]["attacks"] !== undefined){
        element.strength  = data[i].attacks.length*50
        if(element.strength>100){
          element.strength=100
        }

        
        
        for (let i = 0; i < data[i].attacks.length; i++) {

          if(data[i]["attacks"][i].damage !== undefined){

            const add = parseInt(data[i]["attacks"][i].damage)

            if (Number.isInteger(add)){
              element.damage = + add
              console.log(add)
            }
            
          }
        }
       
      }
      else{
        element.strength  = 0
        element.damage  = 0

      }


      if(data[i]["weaknesses"] !== undefined){
        if(data[i].weaknesses.length>0){
          element.weakness=100
        }
      }
      else{
        element.weakness  = 0
      }

      element.happiness = ((element.hp / 10) + (element.damage /10 ) + 10 - (element.weakness)) / 5;
      
      newData.push(element);
    }
    
    // https://github.com/appman-agm/appman-pokedex-2018
    return newData
  }



  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '') {
        const filteredData = allPokemons.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
        })
        setFilteredResults(filteredData)
    }
    else{
        setFilteredResults(allPokemons)
    }
  }


  useEffect(() => {
    fetch('http://localhost:3030/api/cards')
    // fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setAllPokemons(addData(Array.from(data.cards))))
      .catch(err => setErrors(err));
    
  },[])
  
  const windownScreen ={
    width : '1024px',
     height : '720px',
  }

  const imageStyle = {
    height : 'auto',
    width : '100px'
    // position : 'absolute'
  };

  return (
      <div className="App">

        <div>
          <p1>Search Pokemons</p1><br></br>
          <input icon='search'
            placeholder='Search...'
            onChange={(e) => searchItems(e.target.value)}/>
        </div>

        <div className='row ' style={windownScreen}>

        {searchInput.length > 0 ? (
          <div className='column w-450 over-screen'>

            <ul>
              {Array.from(filteredResults).map(character => 
              <li key={character.id}>
                <div className='dp-inline row' >
                  <img className='column' style={imageStyle} src={character.imageUrl} alt="{character.name}" /><br></br>
                  <div className='column'>
                    name :{character.name}<br></br>
                    hp :{character.hp}<br></br>
                    strength :{character.strength}<br></br>
                    weakness :{character.weakness}<br></br>
                    damage :{character.damage}<br></br>
                    happiness :{character.happiness}<br></br>
                  </div>
                  <button name={character.name} onClick={handleAddCharacter}>
                    add to my list
                  </button>
                </div>
                <br></br>
                <br></br>
                </li>
              )}
            </ul>
          </div>
          ) 
          :
          <div className='column w-450 over-screen'>
            <ul>
              {Array.from(allPokemons).map(character => 
              <li key={character.id}>
                <div className='row dp-inline' >
                  <img className='column' style={imageStyle} src={character.imageUrl} alt="{character.name}" /><br></br>
                  <div className='column'>
                    name :{character.name}<br></br>
                    hp :{character.hp}<br></br>
                    strength :{character.strength}<br></br>
                    weakness :{character.weakness}<br></br>
                    damage :{character.damage}<br></br>
                    happiness :{character.happiness}<br></br>
                  </div>
                  <button name={character.name} onClick={handleAddCharacter}>
                    add to my list
                  </button>
                </div>
                <br></br>
                <br></br>
                </li>
              )}
            </ul>
          </div>
          }

          <div  className='column w-450 over-screen '>   
            <p1>My Pokemons</p1> 
            <ul>
              {Array.from(myPokemons).map(mycharacter => 
              <li key={mycharacter.id}>
                <div className='row' style={{display :'inline'}} >
                  <img className='column' style={imageStyle} src={mycharacter.imageUrl} alt="{mycharacter.name}" /><br></br>
                  <div className='column'>
                    name :{mycharacter.name}<br></br>
                    hp :{mycharacter.hp}<br></br>
                    strength :{mycharacter.strength}<br></br>
                    weakness :{mycharacter.weakness}<br></br>
                    damage :{mycharacter.damage}<br></br>
                    happiness :{mycharacter.happiness}<br></br>
                  </div>
                </div>
                <button name={mycharacter.name} onClick={handleRemoveCharacter}>
                    remove
                </button>
                <br></br>
                <br></br>
                </li>
              )}
            </ul>
          </div>
          {/* <span>{JSON.stringify(allPokemons)}</span> */}
        </div>


      </div>
  );

  
}

export default App
