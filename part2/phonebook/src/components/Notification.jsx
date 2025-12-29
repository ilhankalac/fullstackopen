const Notification = ({notification}) => {
  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification