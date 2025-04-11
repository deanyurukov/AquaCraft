const ErrorMessage = ({ error }) => {
    return (
        <section id="notifications">
            <div className="notification">
                <span className="msg">{error}</span>
            </div>
        </section>
    );
}

export default ErrorMessage;