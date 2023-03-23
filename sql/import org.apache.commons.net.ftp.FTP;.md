import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import java.io.*;

public class FtpOperation {
    private String server;
    private int port;
    private String user;
    private String password;
    private FTPClient ftp;

    public FtpOperation(String server, int port, String user, String password) {
        this.server = server;
        this.port = port;
        this.user = user;
        this.password = password;
    }
    
    public boolean connect() {
        ftp = new FTPClient();
        try {
            ftp.connect(server, port);
            ftp.login(user, password);
            ftp.enterLocalPassiveMode();
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean uploadFile(String remoteFilePath, String localFilePath) {
        try (InputStream input = new FileInputStream(new File(localFilePath))) {
            return ftp.storeFile(remoteFilePath, input);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean downloadFile(String remoteFilePath, String localFilePath) {
        try (OutputStream output = new FileOutputStream(new File(localFilePath))) {
            return ftp.retrieveFile(remoteFilePath, output);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean deleteFile(String remoteFilePath) {
        try {
            return ftp.deleteFile(remoteFilePath);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean disconnect() {
        try {
            ftp.logout();
            ftp.disconnect();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}