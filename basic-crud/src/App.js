import logo from './logo.svg';
import './App.css';
import {useState} from 'react';



function Nav ({topics, onChangeMode}) {
  const lis = [];
  topics.map(topic => 
    lis.push(<li key={topic.id}>
      <a id={topic.id} href={'/read/' + topic.id} onClick={(e) => {
        e.preventDefault();
        onChangeMode(Number(e.target.id));
      }}>{topic.title}</a></li>)
  )
  
  
  
  return (
    <nav>
      <ol>
      {lis}
      </ol>
    </nav>
  );
}


function Article ({ title, body }) {
  return (
    <article>
      <h2>{title}</h2>
      {body}
    </article>
  );
}

function Header ({title, onChangeMode}) {
  // console.log(title)
  return (
    <header>
      <h1>
        <a href='/' onClick={(e) => {
          e.preventDefault();
          onChangeMode();
        }}>{title}</a>
      </h1>
    </header>
  );
}

function Create({ onCreate }) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      onCreate(title, body)
    }}> 
      <p><input type='text' name='title' placeholder='title' /></p>
      <p><textarea name='body' placeholder='body' /></p>
      <p><input type='submit' value='Create' /></p>
    </form>
  </article>
}

function Update(props) {
  const [ title, setTitle ] = useState(props.title);
  const [ body, setBody ] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={(e)=>{
    e.preventDefault();
    const title = e.target.title.value;
    const body = e.target.body.value;
    props.onUpdate(title, body)
  }}> 
    <p><input type='text' name='title' placeholder='title' value={title} onChange={(e) => {
      // console.log(e.target.value);
      setTitle(e.target.value);
    }} /></p>
    <p><textarea name='body' placeholder='body' value={body} onChange={(e) => {
      // console.log(e.target.value);
      setBody(e.target.value);
    }} /></p>
    <p><input type='submit' value='Update' /></p>
  </form>
</article>
}
function App() {
  const [ mode, setMode ] = useState('WELCOME');
  const [ id, setId ] = useState(null);
  const [ nextId, setNextId ] = useState(4);
  const [ topics, setTopics ] = useState([
    {id: 1, title: 'html', body: 'html is ...'},
    {id: 2, title: 'css', body: 'css is ...'},
    {id: 3, title: 'js', body: 'js is ...'}
  ]);

  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME') {
    content = <Article title='WELCOME' body='Hello, WEB'/>
  } else if(mode === 'READ') {
    let title, body = null;
    topics.map(topic => {
      console.log(topic.id, id);
      if(topic.id === id) {
        title = topic.title;
        body = topic.body
      } 
    })
    content = <Article title={title} body={body}/>
    contextControl = <>
    <li><a href={'/update'+id} onClick={(e) => {
      e.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type="button" value="Delete" onClick={() => {
      const newTopics = []
      for(let i=0; i<topics.length; i++) {
        if(topics[i].id !== id) {
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }} /></li>
    </>
  }   else if (mode === 'CREATE') {
    content = <Create onCreate={ (_title, _body) => {
      const newTopic = {id:nextId, title:_title, body:_body}
      setTopics([...topics, newTopic])
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
      // topics.push(newTopic);
      // setTopics(topics);
    }}></Create>
  } else if(mode === 'UPDATE') {
    let title, body = null;
    topics.map(topic => {
      console.log(topic.id, id);
      if(topic.id === id) {
        title = topic.title;
        body = topic.body
      }})
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      console.log(title, body);
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++) {
        newTopics[i] = updatedTopic;
        break;
      }
      setTopics(newTopics);
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={() => {setMode('WELCOME')}} />
      <Nav topics={topics} onChangeMode={(_id) => {setMode('READ'); setId(_id);}} />
      {content}
      <ul>
      <li><a href='/create' onClick={(e) => {
        e.preventDefault()
        setMode('CREATE');
      }}>Create</a></li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
