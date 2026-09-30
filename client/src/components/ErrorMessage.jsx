const ErrorMessage = ({ error }) => {
    return (
        <section id="notifications-container">
            <div className="notification">
                <span className="msg">{error}</span>
            </div>
        </section>
    );
}

export default ErrorMessage;