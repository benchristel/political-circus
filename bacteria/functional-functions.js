let head = xs => xs[0]

let tail = xs => xs.slice(1)

let empty = xs => !xs.length

let shallowCopy = obj => Object.assign({}, obj)

let revise = (draft, key, value) => {
  let copy = shallowCopy(draft)
  copy[key] = value
  return copy
}

let apply = (subject, path, transform) =>
  empty(path)?
    transform(subject)
  : revise(
      subject,
      head(path),
      apply(subject[head(path)], tail(path), transform))

let atPath = (path, transform) => (subject) =>
  apply(
    subject,
    path.split('/').filter(s => s !== ''), transform)

let $ = (subject, ...functions) => {
  let v = subject
  for (let f of functions) {
    v = f(v)
  }
  return v
}
