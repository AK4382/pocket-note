import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('#ffffff');
  const [groups, setGroups] = useState(() => {
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    return savedGroups.filter(group => group && group.name); // Filter out invalid groups
  });
  const [currentGroup, setCurrentGroup] = useState(() => JSON.parse(localStorage.getItem('currentGroup')) || null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('messages')) || []);

  const colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F3FF33', '#8A33FF'];

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('currentGroup', JSON.stringify(currentGroup));
  }, [currentGroup]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const handleAddGroup = () => {
    if (!groupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    if (groups.find(group => group.name?.toLowerCase() === groupName.toLowerCase())) {
      setError('Group name must be unique');
      return;
    }

    const initials = groupName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');

    const newGroup = { name: groupName, initials, color: groupColor };
    setGroups([...groups, newGroup]);
    setCurrentGroup(newGroup);
    setGroupName('');
    setGroupColor('#ffffff');
    setError('');
    setShowPopup(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const timestamp = new Date();
    const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedDate = timestamp.toLocaleDateString('en-GB');

    const newMessage = {
      text: message.trim(),
      time: formattedTime,
      date: formattedDate,
      group: currentGroup.name,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const filteredMessages = currentGroup
    ? messages.filter(msg => msg.group === currentGroup.name)
    : [];

  const handleOutsideClick = (e) => {
    if (e.target.className === 'popupOverlay') {
      setShowPopup(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <div style={styles.leftTop}>Pocket Note</div>
        <div style={styles.groupsList}>
          {groups.map((group, index) => (
            <div
              key={index}
              style={styles.groupItemContainer}
              onClick={() => {
                setCurrentGroup(group);
              }}
            >
              <div style={{ ...styles.groupItemCircle, backgroundColor: group.color }}>{group.initials}</div>
              <span style={styles.groupItemText}>{group.name}</span>
            </div>
          ))}
        </div>
        <div style={styles.leftBottom} onClick={() => setShowPopup(true)}>+</div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        {currentGroup ? (
          <div style={styles.groupContainer}>
            <div style={styles.groupHeader}>
              <div style={{ ...styles.groupHeaderCircle, backgroundColor: currentGroup.color }}>{currentGroup.initials}</div>
              <span style={styles.groupHeaderText}>{currentGroup.name}</span>
            </div>
            <div style={styles.messageList}>
              {filteredMessages.map((msg, index) => (
                <div key={index} style={styles.messageItem}>
                  <p>{msg.text}</p>
                  <span style={styles.messageTimestamp}>{msg.date} {msg.time}</span>
                </div>
              ))}
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  ...styles.sendButton,
                  backgroundColor: message.trim() ? 'blue' : '#cccccc',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                }}
                disabled={!message.trim()}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.rightCenter}>
            Send and receive messages without keeping your phone online. <br />
            Use Pocket Notes on up to 4 linked devices and 1 mobile phone.
          </div>
        )}
        <div style={styles.rightBottom}>end-to-end encrypted</div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          style={styles.popupOverlay}
          className="popupOverlay"
          onClick={handleOutsideClick}
        >
          <div style={styles.popup}>
            <h3>Create New Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.input}
            />
            <div style={styles.colorOptionsContainer}>
              {colorOptions.map((color, index) => (
                <div
                  key={index}
                  style={{ ...styles.colorOption, backgroundColor: color, border: groupColor === color ? '2px solid black' : 'none' }}
                  onClick={() => setGroupColor(color)}
                />
              ))}
            </div>
            {error && <p style={styles.errorText}>{error}</p>}
            <button onClick={handleAddGroup} style={styles.addButton}>Add Group</button>
            <button onClick={() => setShowPopup(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}




const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  leftSection: {
    width: "30%",
    backgroundColor: "#f1f1f1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  leftTop: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  groupsList: {
    flexGrow: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: "20px",
    marginTop: "20px",
  },
  groupItemContainer: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    cursor: "pointer",
  },
  groupItemCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginRight: "10px",
  },
  groupItemText: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  leftBottom: {
    fontSize: "40px",
    color: "blue",
    cursor: "pointer",
  },
  rightSection: {
    width: "70%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
  },
  rightCenter: {
    fontSize: "18px",
    lineHeight: "1.5",
  },
  rightBottom: {
    fontSize: "14px",
    color: "gray",
  },
  groupContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  groupHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  groupHeaderCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginRight: "10px",
  },
  groupHeaderText: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  messageList: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    margin: "20px 0",
  },
  messageItem: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
  },
  messageTimestamp: {
    display: "block",
    marginTop: "5px",
    fontSize: "12px",
    color: "gray",
    textAlign: "right",
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #ccc",
  },
  input: {
    flexGrow: 1,
    padding: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  },
  colorOptionsContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    marginBottom: "20px",
  },
  colorOption: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    margin: "0 5px",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
  addButton: {
    backgroundColor: "green",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "10px 20px",
    margin: "10px 5px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
  },

};
export default App;
