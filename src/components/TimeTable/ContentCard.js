
function ContentCard({ title, content }) {
  if(content === null || content === undefined || content === '')
    return

    return (
      <div>
        <span style={{fontWeight: 'bold', paddingRight: 5}}>{title}</span>
        <span>{content}</span>
      </div>
    )
}

export default ContentCard