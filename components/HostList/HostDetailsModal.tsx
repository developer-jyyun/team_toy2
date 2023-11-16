import { useRef } from 'react';
import { BsXCircle } from 'react-icons/bs';
import Button from '@/components/HostList/Button';
import Modal from '@/components/common/Modal';
import useOnClickOutside from '@/hooks/useOnClickOustside';
import chatListAPI from '@/apis/chatListAPI';
import { useRouter } from 'next/router';
import { Chat } from '@/@types/types';
import styles from '@/components/HostList/HostDetailsModal.module.scss';
import { Host } from '@/components/HostList/hostList.types';
import Image from 'next/image';

interface HostDetailsModalProps {
  onClose: () => void;
  hostDetails: Host;
}

export default function HostDetailsModal({
  onClose,
  hostDetails,
}: HostDetailsModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    onClose();
  });

  const findUser = userData.find(user => user.id === hostDetails.id);

  const router = useRouter();
  const createHostChat = async () => {
    // 내가 참여 중인 채팅 목록
    const chatMyList = await chatListAPI.getMyChatList();
    // 숙소와의 채팅만 필터링
    const hostChatList = chatMyList.data.chats.filter(
      (chat: Chat) => chat.isPrivate,
    );

    let chatId = '';
    // 숙소와의 채팅 존재 여부
    const isExist = hostChatList.some((chat: Chat) => {
      if (chat.users.some(user => user.id === hostDetails.id)) {
        chatId = chat.id;
        return true;
      }
      return false;
    });

    // 숙소와 채팅방이 존재하지 않으면 채팅방 생성
    if (!isExist && findUser) {
      chatListAPI
        .createChat({
          name: findUser.name,
          users: [hostDetails.id],
          isPrivate: true,
        })
        .then(res => {
          router.push(`/chat/${res.data.id}`);
        });
    } else {
      // 숙소와 채팅방이 존재하면 채팅방으로 이동
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <>
      <div className={styles.dim} />
      <Modal>
        <div className={styles.ModalBox} ref={ref}>
          <BsXCircle className={styles['close-icon']} onClick={onClose} />
          <Image
            className={styles['host-img']}
            src={hostDetails.picture}
            alt={hostDetails.name}
          />
          <div className={styles['flex-row']}>
            <h4 className={styles.title}>{hostDetails.name}</h4>
            <Button
              className="fill-btn"
              text="문의하기"
              onClick={createHostChat}
            />
          </div>
          <p className={styles.text}>
            <b>주소 :</b> {hostDetails.location} {hostDetails.address}
          </p>

          <p className={styles.text}>
            <b>숙소 소개</b>
            <br />
            {hostDetails.description}
          </p>
          <p className={styles.text}>
            <b>시설 및 서비스</b> <br /> {hostDetails.service}
          </p>
        </div>
      </Modal>
    </>
  );
}
