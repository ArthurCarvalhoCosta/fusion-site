import './Differentials.css'
import checkIcon from '../../assets/img/check.png'

const items = [
  {
    title: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export const Differentials = () => {
  return (
    <section
      className="differentials-container"
      id="differentials"
      aria-label="Diferenciais da Fusion"
    >
      <div className="section-title">
        <span className="background-number">01</span>
        <h2>
          Diferenciais da <br />
          <span className="highlight">Fusion</span>
        </h2>
      </div>
      <div className="items-grid">
        {items.map((item, index) => (
          <article className="item-card" key={index}>
            <div className="icon-wrapper">
              <img src={checkIcon} alt="Ícone de verificação" />
            </div>
            <h3 className="item-title">{item.title}</h3>
            <p className="item-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
