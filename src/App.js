import React, { useState, useEffect, useReducer } from "react";

import "./App.css";

import Nav from "./Nav";
import Main from "./Main";
import Login from "./Login";
import Approveadd from "./Approveadd";
import Contacts from "./Contacts";
import Addgroup from "./Addgroup";
import Groupcontacts from "./Groupcontacts";

import { Menu, Icon, Sidebar } from "semantic-ui-react";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "entropy-messenger.firebaseapp.com",
  databaseURL: "https://entropy-messenger.firebaseio.com",
  projectId: "entropy-messenger",
  storageBucket: "entropy-messenger.appspot.com",
  messagingSenderId: "739103714260",
  appId: "1:739103714260:web:9f34197363bb3b2e4dc441",
  measurementId: "G-WNTGXPFSRH",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var dbFunc = firebase.firestore;

const App = () => {
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [chatIDs, setChatIDs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const [loginOpen, setLoginOpen] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorCode, setLoginErrorCode] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [approveAddOpen, setApproveAddOpen] = useState(false);
  const [addRequests, setAddRequests] = useState([]);
  const [openContacts, setOpenContacts] = useState(false);
  const [addGroup, setAddGroup] = useState(false);
  const [groupContacts, setGroupContacts] = useState(false);
  const [groupAddName, setGroupAddName] = useState("This is the wrong name");
  const [groupAddContacts, setGroupAddContacts] = useState([]);

  const [visible, setVisible] = useState(false);

  const [chatsData, chatsDataUpdate] = useReducer(
    (state, action) => {
      return {
        chats: state.chats
          .filter((i) => i.chatID !== action.chatID)
          .concat({
            title: action.title,
            type: action.type,
            users: action.users,
            chatID: action.chatID,
          }),
      };
    },
    { chats: [] }
  );
  const [chatsTrans, chatsTransUpdate] = useReducer(
    (state, action) => {
      return {
        chats: state.chats
          .filter((i) => i.chatID !== action.chatID)
          .concat({ chatID: action.chatID, data: action.data }),
      };
    },
    { chats: [] }
  );
  useEffect(() => {
    const userGets = chatsData.chats
      .map((i) => i.users)
      .flat()
      .filter((i) => i.id !== user)
      .map((i) => i.get());
    Promise.all(userGets).then((users) => {
      setUsers(
        users.map((j) => {
          return {
            name: j.data().name,
            email: j.data().email,
            userID: j.id,
          };
        })
      );
    });
  }, [chatsData]);
  const activeChatCallback = (chat) => {
    setActiveChat(chat);
    db.collection("users").doc(user).set({ activeChat: chat }, { merge: true });
  };
  const loginDataLoad = (result) => {
    const userRef = db.collection("users").doc(result.user.uid);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUser(result.user.uid);
          userRef.onSnapshot((snapshot) => {
            handleUserUpdate(snapshot);
          });
        } else {
          db.collection("users").doc(result.user.uid).set(
            {
              name: result.user.displayName,
              email: result.user.email,
              chats: [],
              contacts: [],
              activeChat: null,
              addrequests: [],
            },
            { merge: false }
          );
        }
      })
      .then(() => {
        setLoginOpen(false);
        setLoginError(false);
      });
  };
  const loginSubmitCallback = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => loginDataLoad(result));
  };
  const googleLoginSubmitCallback = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => loginDataLoad(result));
  };
  const handleUserUpdate = (snapshot) => {
    handleAddRequests(snapshot.data().addrequests);
    handleChats(snapshot.data().chats);
    handleName(snapshot.data().name);
  };
  const handleChats = (chatIDs) => {
    setChatIDs(chatIDs);
  };
  const handleName = (name) => {
    setName(name);
  };
  useEffect(() => {
    chatIDs
      .filter((i) => !chatsData.chats.find((j) => j.chatID === i))
      .forEach((chatID) => {
        db.collection("chats")
          .doc(chatID)
          .onSnapshot((result) => {
            chatsDataUpdate({
              title: result.data().title,
              type: result.data().type,
              users: result.data().users,
              chatID: result.id,
            });
          });
        const query = db.collection(chatID).orderBy("date", "asc");
        query.onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          Promise.resolve().then(() => {
            chatsTransUpdate({ chatID: chatID, data: data });
          });
        });
      });
  }, [chatIDs]);
  const handleAddRequests = (requests) => {
    if (requests.length > 0) {
      const contactGets = requests.map((request) => request.get());
      Promise.all(contactGets).then((results) => {
        setAddRequests(results);
      });
      setApproveAddOpen(true);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        height: "100%",
        width: "100%",
      }}
    >
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item
            as="a"
            onClick={() => {
              setAddGroup(true);
              setVisible(false);
            }}
          >
            <Icon name="group" />
            New Group
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={() => {
              setOpenContacts(true);
              setVisible(false);
            }}
          >
            <Icon name="user" />
            Contacts
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={visible}>
          {" "}
          <div
            style={{
              position: "absolute",
              width: "30%",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Nav
              db={db}
              dbFunc={dbFunc}
              user={user}
              name={name}
              users={users}
              chats={chatsData.chats}
              chatsTrans={chatsTrans}
              setActiveChat={activeChatCallback}
              activeChat={activeChat}
              setVisible={setVisible}
            />
          </div>
          <div
            style={{
              position: "fixed",
              left: "30%",
              width: "70%",
              height: "100%",
            }}
          >
            <Main
              db={db}
              dbFunc={dbFunc}
              user={user}
              name={name}
              activeChat={activeChat}
              chats={chatsData.chats}
              users={users}
              chatsTrans={chatsTrans}
            />
          </div>
          <Login
            open={loginOpen}
            loginSubmit={loginSubmitCallback}
            googleLoginSubmit={googleLoginSubmitCallback}
            db={db}
            loginError={loginError}
            loginErrorCode={loginErrorCode}
            loginErrorMessage={loginErrorMessage}
          />
          <Approveadd
            db={db}
            user={user}
            approveAddOpen={approveAddOpen}
            setApproveAddOpen={setApproveAddOpen}
            addRequests={addRequests}
            setAddRequests={setAddRequests}
          />
          <Contacts
            open={openContacts}
            db={db}
            user={user}
            setOpenContacts={setOpenContacts}
            chats={chatsData.chats}
            setActiveChat={setActiveChat}
            dbFunc={dbFunc}
            name={name}
          />
          <Addgroup
            open={addGroup}
            setAddGroup={setAddGroup}
            setGroupContacts={setGroupContacts}
            setGroupAddName={setGroupAddName}
          />
          <Groupcontacts
            open={groupContacts}
            name={name}
            setGroupContacts={setGroupContacts}
            setGroupAddContacts={setGroupAddContacts}
            groupAddName={groupAddName}
            user={user}
            db={db}
            dbFunc={dbFunc}
          />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export default App;
