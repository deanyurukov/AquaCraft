const ErrorMessage = ({ error }) => {
    return (
        <section id="notifications-container">
            <div>
                <span>{error}</span>
            </div>
        </section>
    );
}

export default ErrorMessage;