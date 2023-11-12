import React from 'react'

function Text(prop) {
    const {text, text1} = prop;

  return (
    <div>{text} {text1.Name}, Number {text1.Number}</div>
  )
}

export default Text