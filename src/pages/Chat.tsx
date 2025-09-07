import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import styled from "styled-components";

import { userStore } from "../stores/userStore";

import { getChatByLawyerAndClient, sendMessage } from "../services/chatService";
import { getRecommendedUsers } from "../services/usersService";

import { BackgroundColors, BorderColors, GeneralColors } from "../constants/colors";

import { Roles, type Chat, type Message, type User } from "../utils/models";
import { Typography1, Typography2 } from "../components/typography/Typography";
import { FlexColumn, FlexRow } from "../styles/StyledComponents";
import { Subtitle1, Subtitle3, Title1, Title3 } from "../components/typography/Titles";
import CustomSearchBar from "../components/inputs/CustomSearchBar";
import CustomInput from "../components/inputs/CustomInput";

export default function Chat() {
  const { user } = userStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // console.log("logger", selectedConversation);
  console.log("LOGGER messages", messages);

  const { receiverId } = useParams();
  const navigate = useNavigate();

  const isUserLawyer = user?.role === Roles.LAWYER;

  const socketRef = useRef<WebSocket | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const fetchRecommendedUsers = async () => {
    setLoading(true);
    try {
      const users = await getRecommendedUsers();
      setSuggestedUsers(users);
    } catch (error) {
      console.error("Error fetching recommended users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedUsers();
  }, [user]);

  useEffect(() => {
    if (receiverId) {
      getChatByLawyerAndClient(receiverId).then((chat) => {
        if (chat) {
          const mappedMessages = chat.messages.map((message) => ({
            ...message,
            senderName: `${chat.sender.firstName} ${chat.sender.lastName}`,
            receiverName: `${chat.receiver.firstName} ${chat.receiver.lastName}`,
          }));
          setMessages(mappedMessages);
          setSelectedConversation(chat);
        }
      });

      // Initialize WebSocket connection
      socketRef.current = new WebSocket(`ws://localhost:3000/chat/${receiverId}`);

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessage = data.message;

        // Ignore messages sent by the current user
        if (newMessage.senderId !== user?.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        // Cleanup WebSocket connection
        socketRef.current?.close();
      };
    }
  }, [receiverId, user?.id]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user?.id && selectedConversation) {
      sendMessage(selectedConversation.id, newMessage).then((message) => {
        if (message) {
          setMessages((prevMessages) => [...prevMessages, message]);
          // Send the message through WebSocket
          socketRef.current?.send(JSON.stringify(message));
        }
        setNewMessage("");
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return suggestedUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suggestedUsers, searchQuery]);

  const otherParticipant = useMemo(() => {
    if (selectedConversation === null) {
      return null;
    }
    if (receiverId === selectedConversation?.receiverId) {
      return selectedConversation.receiver;
    }
    return selectedConversation?.sender;
  }, [selectedConversation, receiverId]);

  return (
    <FlexColumn gap="24px">
      <FlexColumn>
        <Title1>Chat</Title1>
        <Subtitle1>{`Click on any ${isUserLawyer ? "client" : "lawyer"} to start a conversation`}</Subtitle1>
      </FlexColumn>

      <ChatContainer>
        {/* Conversations List */}
        <ChatElementsContainer>
          <TopbarContainer>
            <CustomSearchBar
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              fullWidth
            />
          </TopbarContainer>
          <Divider />
          {loading ? (
            <CircularProgress sx={{ color: GeneralColors.Gold, margin: "0 auto", marginTop: "32px" }} />
          ) : (
            <List sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
              {filteredUsers.map((suggestedUser) => (
                <ListItem
                  key={suggestedUser.id}
                  onClick={() => {
                    navigate(`/chat/${suggestedUser.id}`);
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "grey.200",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{`${suggestedUser.firstName.charAt(0)}${suggestedUser.lastName.charAt(0)}`}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography2 fontWeight="400">{`${suggestedUser.firstName || ""} ${
                        suggestedUser.lastName || ""
                      }`}</Typography2>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </ChatElementsContainer>

        {/* Chat Messages */}
        <ChatElementsContainer>
          {receiverId ? (
            <>
              {/* Chat Header */}
              <TopbarContainer>
                <FlexRow gap="16px" alignitems="center">
                  <Avatar>{`${otherParticipant?.firstName.charAt(0)}${otherParticipant?.lastName.charAt(0)}`}</Avatar>
                  <Title3 fontWeight="400">{`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}</Title3>
                </FlexRow>
              </TopbarContainer>
              <Divider />

              {/* Messages */}
              <Box sx={{ overflow: "auto", padding: "16px", maxHeight: `calc(100vh - 350px)`, height: "100%" }}>
                {messages.map((message, index) => (
                  <MessageBox
                    isUserSender={message.senderId === user?.id}
                    key={message.id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                  >
                    {message.senderId !== user?.id && (
                      <Avatar sx={{ width: 32, height: 32 }}>{message.senderName?.charAt(0) || "?"}</Avatar>
                    )}
                    <Paper sx={messageStyling(message.senderId === user?.id)}>
                      <Typography1 fontWeight="400" color="inherit">
                        {message.content}
                      </Typography1>
                      <Subtitle3>{new Date(message.createdAt).toLocaleString()}</Subtitle3>
                    </Paper>
                  </MessageBox>
                ))}
              </Box>

              {/* Message Input */}
              <CustomInput
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    padding: "0",
                  },
                }}
                endAdornment={
                  <SendIcon
                    onClick={handleSendMessage}
                    sx={{ cursor: "pointer", color: GeneralColors.Gold, marginRight: "8px" }}
                  />
                }
              />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Typography variant="body1" color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </ChatElementsContainer>
      </ChatContainer>
    </FlexColumn>
  );
}

const ChatContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 190px);
  gap: 2px;
`;

const TopbarContainer = styled.div`
  padding: 16px;
  min-width: 300px;
`;

const ChatElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${BackgroundColors.White};
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid ${BorderColors.Primary};
`;

const messageStyling = (isUserSender: boolean) => ({
  padding: "12px",
  maxWidth: "70%",
  backgroundColor: isUserSender ? GeneralColors.Gold : GeneralColors.LightGray,
  color: isUserSender ? GeneralColors.White : "text.primary",
  borderRadius: "8px",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
});

const MessageBox = styled.div<{ isUserSender: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isUserSender ? "row-reverse" : "row")};
  margin-bottom: 8px;
  align-items: flex-end;
  gap: 8px;
`;
