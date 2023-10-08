import Modal from 'react-modal';
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)'

    },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');
export const MyModal = ({modalIsOpen, closeModal, largeImg, alt}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    ><img src={largeImg} alt={alt}/></Modal>
  );
};
