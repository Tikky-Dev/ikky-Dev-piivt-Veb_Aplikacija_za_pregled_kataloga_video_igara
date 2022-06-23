import { IMailConfiguration } from "./common/IConfig.interface"

const MailConfigurationParameters: IMailConfiguration = {
    host: "smtp.office365.com",
    port: 587,
    email: "exampele@mail.com",
    password: "examplePassword123",
    debug: true,
}

export { MailConfigurationParameters };