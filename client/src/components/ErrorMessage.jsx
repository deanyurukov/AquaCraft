const ErrorMessage = ({ error }) => {
    return (
        <div id="notifications-container">
            <div>
                <span>{error}</span>
            </div>
        </div>
    );
}

export default ErrorMessage;