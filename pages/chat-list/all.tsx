import { useEffect, useState } from 'react';
import { Chat } from '@/@types/types';
import { sortChatList } from '@/utils/chatList';
import useConnectServerSocket from '@/hooks/useConnectServerSocket';
import Header from '@/components/Header/Header';
import {
  ChatListModal,
  CreateChatButton,
  AllChatListItem,
} from '@/components/ChatList';
import chatListAPI from '../../apis/chatListAPI';
import styles from './ChatList.module.scss';

export default function AllChatList() {
  const [isModal, setIsModal] = useState(false);
  const [allChatList, setAllChatList] = useState<Chat[]>([]);
  const getAllChat = async () => {
    const allChats: Chat[] = (await chatListAPI.getAllChatList()).data.chats;
    const sortedAllChatList = sortChatList(allChats);
    setAllChatList(sortedAllChatList);
  };
  useEffect(() => {
    getAllChat();
    const timer = setInterval(() => {
      getAllChat();
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const handleModal = () => {
    setIsModal(!isModal);
  };
  const serverSocket = useConnectServerSocket();
  useEffect(() => {
    serverSocket.on('new-chat', ({ responseChat }) => {
      setAllChatList(preState => [responseChat, ...preState]);
    });
    return () => {
      serverSocket.off('new-chat');
    };
  }, [serverSocket]);

  return (
    <div className={styles.allContainer}>
      <Header pageName="All" />
      <ul>
        {allChatList.map(chat => (
          <AllChatListItem key={chat.id} chat={chat} />
        ))}
      </ul>
      <CreateChatButton setIsModal={setIsModal} />
      {isModal && <ChatListModal handleModal={handleModal} />}
    </div>
  );
}
